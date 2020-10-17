import { useEffect, useState } from "react";
import * as matrixcs from "matrix-js-sdk";
import { useHistory } from 'react-router-dom'

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId
});

const useJoinedRooms = () => {
  const [answer, setAnswer] = useState([]);
  const history = useHistory();

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
        if (error.data.error === "Unrecognised access token") {
          return history.push('/login')
        } else if (error.data.error === "Invalid macaroon passed.") {
          return history.push('/login')
        }
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
