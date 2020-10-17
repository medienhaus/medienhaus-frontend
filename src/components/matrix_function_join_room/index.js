const JoinRoom = (roomId) => {
  fetch(`https://medienhaus.udk-berlin.de/_matrix/client/r0/rooms/${roomId}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("mx_access_token")}`
    }
  });
}

export default JoinRoom;
