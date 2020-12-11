import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom'
import useJoinedRooms from "../../components/matrix_joined_rooms";
import useProfile from "../../components/matrix_profile";
import { Loading } from "../../components/loading"
import { useTranslation } from 'react-i18next';
import matrixcs, { MemoryStore } from "matrix-js-sdk";
import i18n from '../../i18n';


const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true,
  timelineSupport: true,
  unstableClientRelationAggregation: true,
  store: new MemoryStore({
    localStorage: localStorage,
  }),
});

const Account = () => {
  // eslint-disable-next-line
  const joinedRooms = useJoinedRooms();
  const profile = useProfile();
  const [mail, setMail] = useState("");
  const history = useHistory();
  const auth = localStorage.getItem('mx_access_token');
  const logoutRef = useRef(0);
  //const location = useContext();
  const { t } = useTranslation(['translation', 'account']);
  const [logBtnStr, setLogBtnStr] = useState(t('account:logout'))
  const [visibleRooms, setVisibleRooms] = useState([]);

  const visRooms = async () => {
    const visible = await Promise.all(matrixClient.getVisibleRooms());
    setVisibleRooms(visible);
    console.log(visible);
  }

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

  const getSync = async () => {
    try {
      await matrixClient.startClient();
    } catch (e) {
      console.log(e);
    }
  }

  const logout = async () => {
    if (logoutRef.current === 1) {
      await matrixClient.logout();
      localStorage.clear();
      localStorage.setItem('cr_lang', i18n.language)
      history.push('/')
      return window.location.reload(false);
    }
    else {
      logoutRef.current = logoutRef.current + 1;
      setLogBtnStr(t('account:logout2'))
    }
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
      mail ? <p>{mail}</p> : <p>{t('account:email')}</p>
    )
  }

  const LogoutBtn = () => {
    return (
      auth && <button onClick={() => logout()} name="logout">{logBtnStr}</button>
    )
  }

  useEffect(() => {
    getAccData();
    getSync();
    visRooms();
    // eslint-disable-next-line
  }, [profile]);

  useEffect(() => {
    LogoutBtn();
    // eslint-disable-next-line
  }, [t]);
  return (
    <>
      {joinedRooms.length === 0 ? (<Loading />) : (
        <section className="account">
          <ProfilePic />
          <p>{t('account:rooms.text')}</p>
          <ul>
            {[...joinedRooms].sort().map(joinedRoom => (
              joinedRoom !== "" && <li key={joinedRoom}>{joinedRoom}</li>
            ))}
          </ul>
          {/*<LogoutBtn />*/}
        </section>
      )
      }
      {console.log(visibleRooms)}
    </>
  );
}

export default Account;
