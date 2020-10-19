import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom'
import { UserContext } from '../../components/context/UserContext'
import Profile from "../../components/matrix_profile";
import { Loading } from "../../components/loading/loading";
import ReactPlayer from 'react-player'

const Dashboard = () => {
  //const [auth, setAuth] = useContext(AuthProvider);
  const [token, setToken] = useState();
  const { user } = useContext(UserContext);

  const getAuth = () => {
    setToken(localStorage.getItem('mx_access_token'));
    //console.log(location.pathname);
  }
  const profile = Profile();

  const Videos = () => {
    return (
      <>
        <p>Getting started:</p>
        <div className="wrapper">
          <ReactPlayer className="videoplayer" playing url='vid/public_onboarding.mp4' light controls volume='0.6' />
        </div>
        <p>Public vs. Private rooms</p>
        <div className="wrapper">
          <ReactPlayer className="videoplayer" playing url='vid/teacher_onboarding_visibility.mp4' light controls volume='0.6' />
        </div>
        <p>How can I add widgets like video calling to my room?</p>
        <div className="wrapper">
          <ReactPlayer className="videoplayer" playing url='vid/teacher_onboarding_widgets.mp4' light controls volume='0.6' />
        </div>
      </>
    )
  }

  useEffect(() => {
    getAuth();
  }, [user])

  return (
    token === null ? <Redirect to='/' /> : (
      profile.length === 0 ? (<Loading />) : (
        <section className="landing">
          <h2>Hello <strong>{profile.displayname}</strong>, you are now logged in.</h2> {user}
          <ul>
            <li><strong><a href="/account">/account</a></strong> your profile and a list of your rooms</li>
            <li><strong><a href="/explore">/explore</a></strong> explore, join, and leave public rooms</li>
            <li><strong><a href="/docs">/docs</a></strong> documentation, how-to and usage guide</li>
            <li><strong><a href="/help">/help</a></strong> frequently asked questions and answers</li>
            <li><strong><a href="/support">/support</a></strong> in case of undocumented problems</li>
            <li><strong><a href="/request">/request</a></strong> openly accessible public rooms</li>
          </ul>
          <Videos />
        </section>
      )
    )
  )
}

export default Dashboard;
