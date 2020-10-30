import React, { useEffect, useState } from 'react';
import { Loading } from "../../components/loading";
import { useHistory } from 'react-router-dom'
import roomStructure from "../../assets/data/naming.json"
import PublicRooms from "../../components/matrix_public_rooms"
import * as matrixcs from "matrix-js-sdk";
import { useTranslation } from 'react-i18next';

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
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const publicRooms = PublicRooms();
  const history = useHistory();
  const { t } = useTranslation(['translation', 'explore']);

  //first let's fetch all rooms our user is part of
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
        console.log("thrown error because leaveId can't be empty")
      });
    setLeaveId("");
  }, [leaveId])

  useEffect(() => {
    matrixClient.joinRoom(joinId)
      .then(() => setUpdate(true))
      .catch((e) => {
        console.log("thrown error because joinId can't be empty")
      }
      );
    setJoinId("");
  }, [joinId])

  const searchBar = e => {
    setSearch(e.target.value)
  }

  const SearchStructure = () => {

    const sort = [...publicRooms].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return ([...sort].map(publicRoom => (
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
    ))
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

  //component
  const RoomList = ({ faculty, displayName, type }) => {

    const sort = [...publicRooms].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return (
      <>
        <h3>{displayName}</h3>
        {[...sort].map(publicRoom => (
          publicRoom.name.startsWith(`${faculty}-`) ? (
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

  return (
    <section className="explore">
      <input name="search" type='text' value={search} onChange={(e) => searchBar(e)} placeholder='search …' />
      {publicRooms.length === 0 ? <Loading /> : search ? <SearchStructure /> : <RoomStructure />}
    </section>
  );
}

export default Explore;
