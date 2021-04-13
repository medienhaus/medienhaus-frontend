import React from 'react'
import PropTypes from 'prop-types'
import JoinLeaveButton from './joinLeaveButton'

const RoomListEntry = ({ roomId, name, avatar, isPartOfRoom, onJoin, onLeave }) => {
  return (
    <div className="room" key={roomId}>
      {avatar}
      <label htmlFor={roomId}>{name}</label>
      <JoinLeaveButton
        id={roomId}
        isPartOfRoom={isPartOfRoom}
        onJoin={onJoin}
        onLeave={onLeave}
      />
    </div>
  )
}

RoomListEntry.propTypes = {
  roomId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.element.isRequired,
  isPartOfRoom: PropTypes.bool.isRequired,
  onJoin: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired
}

export default RoomListEntry
