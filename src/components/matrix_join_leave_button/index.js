import React, { useState } from "react";
import Matrix from "../../Matrix";

const JoinLeaveButton = ({ name, roomId }) => {
  const [isLoading, setLoading] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState([]);

  const matrixClient = Matrix.getMatrixClient();

  const getJoinedRooms = async () => {
    const answer = await matrixClient.getJoinedRooms();
    const getNames = await Promise.all(answer.joined_rooms.map(async (roomId) => {
      try {
        const room = await matrixClient.getStateEvent(roomId, "m.room.name");
        if (room.name !== "") {
          return room.name;
        } else {
          return "[[ Untitled Chat ]]";
        }
      } catch (error) {
        return "[[ Private Chat ]]";
      }
    }));
    setJoinedRooms(getNames);
  }

  const handleClick = () => {
    setLoading(true);
    if (joinedRooms.includes(name)) {
      matrixClient.leave(roomId);
    } else {
      matrixClient.joinRoom(roomId);
    }
    getJoinedRooms();
    setLoading(false);
  }

  const handleText = () => {
    if (joinedRooms.includes(name)) {
      return "LEAVE"
    } else {
      return "JOIN"
    }
  }

  return (
    <button
      name={name}
      onClick={!isLoading ? handleClick() : null}
      disabled={isLoading}
    >
      {isLoading ? "Loading …" : handleText()}
    </button>
  );
}

export default JoinLeaveButton;
