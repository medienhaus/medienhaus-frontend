import { useEffect, useState } from 'react';
import * as matrixcs from "matrix-js-sdk";

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader = true
});

const useProfile = () => {
  const [answer, setAnswer] = useState([]);

  const getAnswer = async () => {
    try {
      const answer = await matrixClient.getProfileInfo(myUserId);
      setAnswer(answer);
    } catch (e) {

    }
  }

  useEffect(() => {
    getAnswer();
  }, []);

  return answer;
}

export default useProfile;
