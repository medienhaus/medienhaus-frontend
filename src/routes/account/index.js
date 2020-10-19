import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import useJoinedRooms from "../../components/matrix_joined_rooms";
import useProfile from "../../components/matrix_profile";
import { Loading } from "../../components/loading/loading"
import * as matrixcs from "matrix-js-sdk";

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true
});

const Account = () => {
  // eslint-disable-next-line
  const joinedRooms = useJoinedRooms();
  const profile = useProfile();
  const [mail, setMail] = useState("");
  const history = useHistory();
  const auth = localStorage.getItem('mx_access_token');

  const getAccData = async () => {
    try {
      const email = await matrixClient.getThreePids();
      // eslint-disable-next-line
      email.threepids.map((item, index) => {
        setMail(email.threepids[index].address);
      })
    } catch (e) {
      if (e.data.error === "Invalid macaroon passed.") {
        history.push('/login')
      } else if (e.data.error === "Unrecognised access token") {
        alert("Oops something went wrong! Please try logging in again")
        localStorage.clear();
        history.push('/login');
      }
      console.log(e.data.error);
    }
  }
  /*
  const getSync = async () => {
    try {
      const res = await matrixClient.isInitialSyncComplete();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
  */

  const logout = async () => {
    await matrixClient.logout();
    localStorage.clear();
    history.push('/')
    return window.location.reload(false);
  }

  const ProfilePic = () => {
    const src = matrixClient.mxcUrlToHttp(profile.avatar_url, 100, 100, "crop", true);
    return (<div className="pofile">
      { profile.avatar_url ? <img className="avatar" src={src} alt="avatar" /> : <canvas className="avatar" style={{ backgroundColor: 'black' }}></canvas>}
      < div >
        <h2><strong>{profile.displayname}</strong></h2>
        <Email />
      </div >
    </div >
    )
  }

  const Email = () => {
    return (
      mail ? <p>{mail}</p> : <p>please add an email address to your profile</p>
    )
  }

  const LogoutBtn = () => {
    return (
      auth ? <button onClick={() => logout()} name="logout">LOGOUT</button> : null
    )
  }

  useEffect(() => {
    getAccData();
    //getSync();
    // eslint-disable-next-line
  }, [profile]);

  return (
    <>

      {joinedRooms.length === 0 ? (<Loading />) : (
        <section className="account">
          <ProfilePic />
          <p>You are currently part of the following rooms:</p>
          <ul>
            {[...joinedRooms].sort().map(joinedRoom => (
              joinedRoom !== "" && <li key={joinedRoom}>{joinedRoom}</li>
            ))}
          </ul>
          <LogoutBtn />
        </section>
      )
      }
    </>
  );
}

export default Account;
