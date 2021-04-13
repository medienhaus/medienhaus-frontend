import { sortBy } from 'lodash-es'
import RoomListEntry from './roomListEntry'
import PropTypes from 'prop-types'
import React from 'react'
import Matrix from '../../Matrix'

const RoomList = ({ roomsToList, joinedRooms, onJoinRoom, onLeaveRoom }) => {
  const matrixClient = Matrix.getMatrixClient()

  return (
    <>
      {sortBy(roomsToList, 'name').map(room => (
        <RoomListEntry
          isPartOfRoom={room.room_id in joinedRooms}
          onLeave={onLeaveRoom}
          name={room.name}
          roomId={room.room_id}
          onJoin={onJoinRoom}
          key={room.room_id}
          avatar={(
            room.avatar_url
              ? <img className="avatar" src={matrixClient.mxcUrlToHttp(room.avatar_url, 100, 100, 'crop', false)} alt="avatar"/>
              : <canvas className="avatar" style={{ backgroundColor: 'black' }}></canvas>
          )}
        />
      ))}
    </>
  )
}

RoomList.propTypes = {
  roomsToList: PropTypes.object.isRequired,
  joinedRooms: PropTypes.object.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
  onLeaveRoom: PropTypes.func.isRequired
}

export default RoomList
