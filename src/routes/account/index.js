import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom'
import useJoinedRooms from "../../components/matrix_joined_rooms";
import { Loading } from "../../components/loading"
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Matrix from "../../Matrix";
import {useAuth} from "../../Auth";

const Account = () => {
  // eslint-disable-next-line
  const joinedRooms = useJoinedRooms();
  const [mail, setMail] = useState("");
  const history = useHistory();
  const logoutRef = useRef(0);
  const { t } = useTranslation(['translation', 'account']);
  const [logBtnStr, setLogBtnStr] = useState(t('account:logout'))
  const [visibleRooms, setVisibleRooms] = useState([]);
  const matrixClient = Matrix.getMatrixClient();

  const auth = useAuth();

  const visRooms = async () => {
    const visible = await Promise.all(matrixClient.getVisibleRooms());
    setVisibleRooms(visible);
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

  const profile = auth.user;

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
      <button onClick={() => logout()} name="logout">{logBtnStr}</button>
    )
  }

  useEffect(() => {
    getAccData();
    getSync();
    visRooms();
    // eslint-disable-next-line
  }, []);

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
