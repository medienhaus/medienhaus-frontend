import React, { useEffect, useState } from 'react'
import { Loading } from '../../components/loading'
import roomStructure from '../../assets/data/naming.json'
import federation from '../../assets/data/federation.json'
import PublicRooms from '../../components/matrix_public_rooms'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import Matrix from '../../Matrix'
import PropTypes from 'prop-types'
import Avatar from '../../components/avatar'

const Explore = () => {
  const [joinedRooms, setJoinedRooms] = useState([])
  const [joinId, setJoinId] = useState('')
  const [leaveId, setLeaveId] = useState('')
  const [search, setSearch] = useState('')
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingFed, setloadingFed] = useState()
  const [advancedRoom, setAdvancedRoom] = useState('')
  const [advancedServer, setAdvancedServer] = useState('')
  const [advancedJoining, setAdvancedJoining] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const publicRooms = PublicRooms()
  const [pubFeds, setPubFeds] = useState([])
  const [selectFed, setSelectFed] = useState(false)
  const { register, handleSubmit, errors } = useForm()
  const { t } = useTranslation('explore')
  const matrixClient = Matrix.getMatrixClient()

  //  Fetching all rooms a user has already joined and replacing private rooms with generic names
  const getJoinedRooms = async () => {
    try {
      const answer = await matrixClient.getJoinedRooms()
      const getNames = await Promise.all(answer.joined_rooms.map(async (roomId) => {
        try {
          const room = await matrixClient.getStateEvent(roomId, 'm.room.name')
          if (room.name !== '') {
            return room.name
          } else {
            return '[[ Untyped Chat ]]'
          }
        } catch (error) {
          return '[[ Private Chat ]]'
        }
      }))
      setJoinedRooms(getNames)
    } catch (e) {
      console.log(e.data.error)
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getJoinedRooms()
    setUpdate(false)
    // eslint-disable-next-line
  }, [update, t, search])

  useEffect(() => {
    matrixClient.leave(leaveId)
      .then(() => setUpdate(true))
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? console.log('ID or Alias empty, taking a rest.') : e.data.error === 'Too Many Requests' ? alert(t('Slow Down! You\'re a bit too quick there')) : console.log(e.data.error)
      })
    setLeaveId('')
    // eslint-disable-next-line
  }, [leaveId])

  useEffect(() => {
    matrixClient.joinRoom(joinId)
      .then(() => setUpdate(true))
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? console.log('ID or Alias empty, taking a rest.') : e.data.error === 'Too Many Requests' ? alert(t('Slow Down! You\'re a bit too quick there')) : console.log(e.data.error)
        // console.log(e.data.error)
      }
      )
    setJoinId('')
    // eslint-disable-next-line
  }, [joinId])

  const searchBar = e => {
    setSearch(e.target.value)
  }

  const roomBar = e => {
    e.preventDefault()
    setAdvancedRoom(e.target.value)
  }

  const serverBar = e => {
    e.preventDefault()
    setAdvancedServer(e.target.value)
  }

  const changeServer = async (server) => {
    if (server !== 'baseUrl') {
      setloadingFed(true)
      setSelectFed(server)
      setPubFeds('')
      const opts = {
        server: server,
        limit: 50
      }
      try {
        const answer = await matrixClient.publicRooms(opts)
        setPubFeds(answer.chunk)
      } catch (e) {
        console.log(e)
      }
      setloadingFed(false)
    } else {
      setSelectFed(false)
    }
  }
  const advancedJoin = () => {
    setAdvancedJoining(true)
    matrixClient.joinRoom(`#${advancedRoom}:${advancedServer}`)
      .then(() => alert(t('Joined room successfully')))
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? alert('ID or Alias empty.') : e.data.error === 'Too Many Requests' ? alert(t('Slow Down! You\'re a bit too quick there')) : alert(e.data.error)
        // console.log(e.data.error)
      }
      )
      .then(() => getJoinedRooms())
      .then(() => setAdvancedRoom(''))
      .then(() => setAdvancedServer(''))
      .then(() => setShowAdvanced(false))
      .then(() => setAdvancedJoining(false))
  }

  const SearchStructure = () => {
    const sort = [...publicRooms].sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    const sortFeds = pubFeds ?? [...pubFeds].sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    return (
      <>
        <h2>{selectFed}</h2>
        {[...sortFeds].map(publicRoom => (
          publicRoom.name.includes(search.toLowerCase().replace(/ /g, '')) &&
          <div className="room" key={publicRoom.room_id}>
            <Avatar url={matrixClient.mxcUrlToHttp(publicRoom.avatar_url, 100, 100, 'crop', true)} />
            <label htmlFor={publicRoom.room_id} key={publicRoom.name} >{publicRoom.name}</label>
            {joinedRooms.includes(publicRoom.name)
              ? <button onClick={() => setLeaveId(publicRoom.room_id)} name="Leave">
              {loading ? <Loading /> : t('LEAVE')}</button>
              : <button onClick={() => setJoinId(publicRoom.room_id)} name="Join">{loading ? <Loading /> : t('JOIN')}</button>}
          </div>
        ))}
        <h2>Medienhaus</h2>
        {[...sort].map(publicRoom => (
          publicRoom.name.includes(search.toLowerCase().replace(/ /g, '')) &&
          <div className="room" key={publicRoom.room_id}>
            <Avatar url={matrixClient.mxcUrlToHttp(publicRoom.avatar_url, 100, 100, 'crop', true)} />
            <label htmlFor={publicRoom.room_id} key={publicRoom.name} >{publicRoom.name}</label>
            {joinedRooms.includes(publicRoom.name)
              ? <button onClick={() => setLeaveId(publicRoom.room_id)} name="Leave">
              {loading ? <Loading /> : t('LEAVE')}</button>
              : <button onClick={() => setJoinId(publicRoom.room_id)} name="Join">{loading ? <Loading /> : t('JOIN')}</button>}
          </div>
        ))}
      </>
    )
  }

  const RoomStructure = () => {
    /* We map through our json and look for unique faculty names to add to our array */
    const keys = []
    roomStructure.map(data => (
      keys.push(data.type)
    ))
    const uniqKeys = [...new Set(keys)]

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
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    return (
      <>
        <h3>{displayName}</h3>

        {loading
          ? <Loading />
          : [...sort].map(publicRoom => (
            /* the following structure is very specific to our use case and will most likely need some changes before using it in different scenarios
                we map through all public rooms and check if those rooms start wuth a certain prefix defined in ../../assets/data/naming.json
            */
              publicRoom.name.startsWith(`${faculty}-`) || publicRoom.name.startsWith(`${faculty}+vk-`) || publicRoom.name.startsWith(`kum+${faculty}-`)
                ? (
            <div className="room" key={publicRoom.room_id}>
              <Avatar url={matrixClient.mxcUrlToHttp(publicRoom.avatar_url, 100, 100, 'crop', true)} />
              <label htmlFor={publicRoom.room_id} key={publicRoom.name} name={faculty}>{publicRoom.name}</label>
              {joinedRooms.includes(publicRoom.name)
                ? <button onClick={() => setLeaveId(publicRoom.room_id)} name="Leave">
                {loading ? <Loading /> : t('LEAVE')}</button>
                : <button onClick={() => setJoinId(publicRoom.room_id)} name="Join">{loading ? <Loading /> : t('JOIN')}</button>}
            </div>
                  )
                : (
                    null
                  )
            ))}
      </>
    )
  }

  RoomList.propTypes = {
    faculty: PropTypes.any,
    displayName: PropTypes.string,
    type: PropTypes.any
  }

  const Federations = () => {
    const sort = [...pubFeds].sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    return (
      <>
        <h2>{selectFed}</h2>
        {loadingFed
          ? <Loading />
          : sort.map((pubFed, index) => (
          <div className="federation" key={index}>
            <Avatar url={matrixClient.mxcUrlToHttp(pubFed.avatar_url, 100, 100, 'crop', true)} />
            <label htmlFor={pubFed.room_id} key={index} >{pubFed.name}</label>
            {joinedRooms.includes(pubFed.name)
              ? <button onClick={() => setLeaveId(pubFed.room_id)} name="Leave">
              {loading ? <Loading /> : t('LEAVE')}</button>
              : <button onClick={() => setJoinId(pubFed.canonical_alias)} name="Join">{loading ? <Loading /> : t('JOIN')}</button>}
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
          <input name="search" type="text" value={search} onChange={(e) => searchBar(e)} placeholder="search …" />
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select name="Federations" id="federations" defaultValue="baseUrl" onChange={(e) => changeServer(e.target.value)} >
            {/* TODO: make process.env work in assets/locales/de/explore.json
            <option value="baseUrl">{t(process.env.REACT_APP_MEDIENHAUS_FRONTEND_HOMESERVER_NAME_DEFAULT)}</option>
            */}
            <option value="baseUrl">{process.env.REACT_APP_MEDIENHAUS_FRONTEND_HOMESERVER_NAME_DEFAULT}</option>
            {federation.map((fed, index) => (
              <option key={index} name={fed.server} id={index} value={fed.server} >{fed.name}</option>
            ))}
            {// <option key='ownServer' name='addserver' value='' onClick={() => alert('sup')}>Add new server</option>
            }
          </select>
        </div>
        <div>
          {// <----- Advanced joining method  start ------>
          /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
          <label onClick={() => setShowAdvanced(!showAdvanced)}>{showAdvanced ? '×' : '+'} {t('Advanced options')}</label>
        </div>
      </form>
      {showAdvanced && advancedJoining
        ? <Loading />
        : showAdvanced
          ? (<form id="advanced" onSubmit={handleSubmit(advancedJoin)}>
          <p>{t('Join room directly')}:</p>
          <div>
            <label htmlFor="room">{t('Room')}: </label>
            <input type="text" name="advancedRoom" value={advancedRoom} placeholder="events" onChange={(e) => roomBar(e)} ref={register({ required: true })} />
          </div>
          {errors.advancedRoom && t('Please enter the name of your room.')}
          <div>
            <label htmlFor="server">{t('Server')}: </label>
            <input type="text" name="advancedServer" value={advancedServer} placeholder="klasseklima.org" onChange={(e) => serverBar(e)} ref={register({ required: true })} />
          </div>
          {errors.advancedServer && t('Please enter the name of your server.')}
          <button type="submit" name="Join">{loading ? <Loading /> : t('JOIN')}</button>
        </form>
            )
          : null
      }
      {// <----- Advanced joining method  end ------>

      publicRooms.length === 0 ? <Loading /> : search ? <SearchStructure /> : selectFed ? <Federations /> : <RoomStructure />}
    </section>

  )
}

export default Explore
