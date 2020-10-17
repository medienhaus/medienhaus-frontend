import { useEffect, useState } from "react";
import * as matrixcs from "matrix-js-sdk";

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId
});

const useJoinedRooms = () => {
  const [answer, setAnswer] = useState([]);

  const getAnswer = async () => {
    const answer = await matrixClient.getJoinedRooms();
    const getNames = await Promise.all(answer.joined_rooms.map(async (roomId) => {
      try {
        const room = await matrixClient.getStateEvent(roomId, "m.room.name");
        if (room.name !== "") {
          return room.name;
        } else {
          return ""
        }
      } catch (error) {
        return ""
      }
    }));

    setAnswer(getNames);
  }

  useEffect(() => {
    getAnswer();
  }, []);

  return answer;
}

export default useJoinedRooms;
