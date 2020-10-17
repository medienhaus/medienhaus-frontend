import React, { useEffect, useState, useRef, useContext } from 'react';
import { Redirect } from 'react-router-dom'
import { AuthContext } from '../../components/context/AuthStatus'
import useJoinedRooms from "../../components/matrix_joined_rooms";
import useProfile from "../../components/matrix_profile";
import { Loading } from "../../components/loading/loading"
import * as matrixcs from "matrix-js-sdk";

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId
});

const Account = () => {
  const [auth, setAuth] = useContext(AuthContext);
  const joinedRooms = useJoinedRooms();
  const profile = useProfile();
  const [mail, setMail] = useState("");
  const pageload = useRef(1);

  const getAccData = async () => {
    try {
      const email = await matrixClient.getThreePids();
      email.threepids.map((item, index) => {
        setMail(email.threepids[index].address);
      })
    } catch (e) {
      console.log(e.data.error);
    }
  }

  const ProfilePic = () => {
    const src = matrixClient.mxcUrlToHttp(profile.avatar_url, 100, 100, "crop", false);
    return (<div className="pofile">
      { profile.avatar_url ? <img className="avatar" src={src} alt="avatar" /> : null}
      < div >
        <h2><strong>{profile.displayname}</strong></h2>
        <Email />
      </div >
    </div >
    )
  }

  const Email = () => {
    pageload.current = pageload.current + 1;
    return (
      mail ? <p>{mail}</p> : <p>please add an email address to your profile</p>
    )
  }

  useEffect(() => {
    getAccData();
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
        </section>
      )
      }
    </>
  );
}

export default Account;
