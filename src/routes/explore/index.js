import React, { useEffect, useState } from 'react';
import { Loading } from "../../components/loading";
import { useHistory } from 'react-router-dom'
import roomStructure from "../../assets/data/naming.json"
import federation from "../../assets/data/federation.json"
import PublicRooms from "../../components/matrix_public_rooms"
import * as matrixcs from "matrix-js-sdk";
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import config from '../../config.json'

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true
});

const Explore = () => {
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [joinId, setJoinId] = useState("");
  const [leaveId, setLeaveId] = useState("");
  const [search, setSearch] = useState("");
  const [advancedRoom, setAdvancedRoom] = useState('');
  const [advancedServer, setAdvancedServer] = useState('');
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [advancedJoining, setAdvancedJoining] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingFed, setloadingFed] = useState();
  const publicRooms = PublicRooms();
  const [pubFeds, setPubFeds] = useState([]);
  const [selectFed, setSelectFed] = useState(false);
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const { t } = useTranslation(['translation', 'explore']);

  const getJoinedRooms = async () => {
    try {
      const answer = await matrixClient.getJoinedRooms();
      const getNames = await Promise.all(answer.joined_rooms.map(async (roomId) => {
        try {
          const room = await matrixClient.getStateEvent(roomId, "m.room.name");
          if (room.name !== "") {
            return room.name;
          } else {
            return "[[ Untyped Chat ]]";
          }
        } catch (error) {
          return "[[ Private Chat ]]";
        }
      }));
      setJoinedRooms(getNames);
    } catch (e) {
      if (e.data.error === "Invalid macaroon passed.") {
        history.push('/login')
      } else if (e.data.error === "Unrecognised access token") {
        alert("Oops something went wrong! Please try loggin in again.")
        localStorage.clear();
        history.push('/login');
      }
      console.log(e.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getJoinedRooms();
    setUpdate(false);
    // eslint-disable-next-line
  }, [update, t, search])

  useEffect(() => {
    matrixClient.leave(leaveId)
      .then(() => setUpdate(true))
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? console.log("ID or Alias empty, taking a rest.") : e.data.error === 'Too Many Requests' ? alert(t('explore:ratelimit')) : console.log(e.data.error);
      });
    setLeaveId("");
    // eslint-disable-next-line
  }, [leaveId])

  useEffect(() => {
    matrixClient.joinRoom(joinId)
      .then(() => setUpdate(true))
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? console.log("ID or Alias empty, taking a rest.") : e.data.error === 'Too Many Requests' ? alert(t('explore:ratelimit')) : console.log(e.data.error);
        //console.log(e.data.error)
      }
      );
    setJoinId("");
    // eslint-disable-next-line
  }, [joinId])

  const searchBar = e => {
    setSearch(e.target.value)
  }
  const roomBar = e => {
    e.preventDefault();
    setAdvancedRoom(e.target.value)
  }
  const serverBar = e => {
    e.preventDefault();
    setAdvancedServer(e.target.value)
  }

  const changeServer = async (server) => {
    if (server !== 'baseUrl') {
      setloadingFed(true);
      setSelectFed(server);
      setPubFeds('');
      const opts = {
        server: server,
        limit: 50
      };
      try {
        const answer = await matrixClient.publicRooms(opts);
        setPubFeds(answer.chunk);
      }
      catch (e) {
        console.log(e);
      }
      setloadingFed(false);
    } else {
      setSelectFed(false);
      //setPubFeds('');
    }

  }
  const advancedJoin = () => {
    setAdvancedJoining(true)
    matrixClient.joinRoom(`#${advancedRoom}:${advancedServer}`)
      .then(() => alert(t('explore:advancedJoin')))
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? alert("ID or Alias empty.") : e.data.error === 'Too Many Requests' ? alert(t('explore:ratelimit')) : alert(e.data.error);
        //console.log(e.data.error)
      }
      )
      .then(() => getJoinedRooms())
      .then(() => setAdvancedRoom(''))
      .then(() => setAdvancedServer(''))
      .then(() => setShowAdvanced(false))
      .then(() => setAdvancedJoining(false))

  }

  const SearchStructure = () => {


    const sort =
      selectFed ?
        [...pubFeds].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        :
        [...publicRooms].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0
        })

    return (
      <>
        {[...sort].map(publicRoom => (
          publicRoom.name.includes(search.toLowerCase().replace(/ /g, '')) &&
          <div className="room" key={publicRoom.room_id}>
            {publicRoom.avatar_url ? (
              <img className="avatar" src={matrixClient.mxcUrlToHttp(publicRoom.avatar_url, 100, 100, "crop", false)} alt="avatar" />
            ) : (
                <canvas className="avatar" style={{ backgroundColor: 'black' }}></canvas>
              )}
            <label htmlFor={publicRoom.room_id} key={publicRoom.name} >{publicRoom.name}</label>
            {joinedRooms.includes(publicRoom.name) ? <button onClick={() => setLeaveId(publicRoom.room_id)} name="Leave">
              {loading ? <Loading /> : t('explore:buttonLeave')}</button> :
              <button onClick={() => setJoinId(publicRoom.room_id)} name="Join">{loading ? <Loading /> : t('explore:buttonJoin')}</button>}
          </div>
        ))}
      </>
    )
  }

  const RoomStructure = () => {
    const keys = []
    roomStructure.map(data => (
      keys.push(data.type)
    ))
    const uniqKeys = [...new Set(keys)];;

    return (

      uniqKeys.map(keys => (
        <><h2 style={{ textTransform: 'capitalize' }}>{keys}</h2>
          {roomStructure.map((data, index) => (
            keys === data.type && <RoomList faculty={data.faculty} displayName={data.displayName} type={data.type} key={data.id} />
          ))}
        </>)
      )

    )
  }

  const RoomList = ({ faculty, displayName, type }) => {
    const sort = [...publicRooms].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return (
      <>
        <h3>{displayName}</h3>

        {loading ? <Loading /> : [...sort].map(publicRoom => (
          publicRoom.name.startsWith(`${faculty}-`) || publicRoom.name.startsWith(`${faculty}+vk-`) || publicRoom.name.startsWith(`kum+${faculty}-`) ? (
            <div className="room" key={publicRoom.room_id}>
              {publicRoom.avatar_url ? (
                <img className="avatar" src={matrixClient.mxcUrlToHttp(publicRoom.avatar_url, 100, 100, "crop", false)} alt="avatar" />
              ) : (
                  <canvas className="avatar" style={{ backgroundColor: 'black' }}></canvas>
                )}
              <label htmlFor={publicRoom.room_id} key={publicRoom.name} name={faculty}>{publicRoom.name}</label>
              {joinedRooms.includes(publicRoom.name) ? <button onClick={() => setLeaveId(publicRoom.room_id)} name="Leave">
                {loading ? <Loading /> : t('explore:buttonLeave')}</button> :
                <button onClick={() => setJoinId(publicRoom.room_id)} name="Join">{loading ? <Loading /> : t('explore:buttonJoin')}</button>}
            </div>
          ) : (
              null
            )
        ))}
      </>
    )
  }
  const Federations = () => {
    const sort = [...pubFeds].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return (
      <>
        <h2>{selectFed}</h2>
        {loadingFed ? <Loading /> : sort.map((pubFed, index) => (
          <div className="federation" key={index}>
            {pubFed.avatar_url ? (
              <img className="avatar" src={matrixClient.mxcUrlToHttp(pubFed.avatar_url, 100, 100, "crop", false)} alt="avatar" />
            ) : (
                <canvas className="avatar" style={{ backgroundColor: 'black' }}></canvas>
              )}
            <label htmlFor={pubFed.room_id} key={index} >{pubFed.name}</label>
            {joinedRooms.includes(pubFed.name) ? <button onClick={() => setLeaveId(pubFed.room_id)} name="Leave">
              {loading ? <Loading /> : t('explore:buttonLeave')}</button> :
              <button onClick={() => setJoinId(pubFed.canonical_alias)} name="Join">{loading ? <Loading /> : t('explore:buttonJoin')}</button>}
          </div>
        )
        )}
      </>
    )
  }
  return (
    <section className="explore">
      <form id="server">
        <div id="toolbar">
          <input name="search" type='text' value={search} onChange={(e) => searchBar(e)} placeholder='search …' />
          <select name="Federations" id="federations" defaultValue='baseUrl' onChange={(e) => changeServer(e.target.value)} >
            <option value='baseUrl'>{config.baseUrlAlias}</option>
            {federation.map((fed, index) => (
              <option key={index} name={fed.server} id={index} value={fed.server} >{fed.name}</option>
            ))}
            {// <option key='ownServer' name='addserver' value='' onClick={() => alert('sup')}>Add new server</option>
            }
          </select>
        </div>
        <div>
          <label onClick={() => setShowAdvanced(!showAdvanced)}>{showAdvanced ? '×' : '+'} {t('explore:advanced')}</label>
        </div>
      </form>
      {showAdvanced && advancedJoining ? <Loading /> : showAdvanced ?
        (<form id='advanced' onSubmit={handleSubmit(advancedJoin)}>
          <p>{t('explore:advancedP')}</p>
          <div>
            <label htmlFor="room">{t('explore:advancedRoom')}</label><input type='text' name='advancedRoom' value={advancedRoom} placeholder='events' onChange={(e) => roomBar(e)} ref={register({ required: true })}></input>
          </div>
          {errors.advancedRoom && t('explore:advancedRoomError')}
          <div>
            <label htmlFor="server">{t('explore:advancedServer')}</label><input type='text' name='advancedServer' value={advancedServer} placeholder='klasseklima.org' onChange={(e) => serverBar(e)} ref={register({ required: true })}></input>
          </div>
          {errors.advancedServer && t('explore:advancedServerError')}
          <button type='submit' name="Join">{loading ? <Loading /> : t('explore:buttonJoin')}</button>
        </form>
        )
        : null
      }

      {publicRooms.length === 0 ? <Loading /> : search ? <SearchStructure /> : selectFed ? <Federations /> : <RoomStructure />}
    </section>

  );
}

export default Explore;
