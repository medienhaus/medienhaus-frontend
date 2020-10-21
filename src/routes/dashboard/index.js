import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom'
import { UserContext } from '../../components/context/UserContext'
import Profile from "../../components/matrix_profile";
import { Loading } from "../../components/loading";
//import ReactPlayer from 'react-player'

const Dashboard = () => {
  //const [auth, setAuth] = useContext(AuthProvider);
  const [token, setToken] = useState();
  const { user } = useContext(UserContext);
  const profile = Profile();

  const getAuth = () => {
    setToken(localStorage.getItem('mx_access_token'));
    //console.log(location.pathname);
  }

  /*
  const Videos = () => {
    return (
      <>
        <p>Getting started:</p>
        <div className="videowrapper">
          <ReactPlayer className="videoplayer" playing url='vid/public_onboarding.mp4' light controls volume='0.6' />
        </div>
        <p>Public vs. Private rooms</p>
        <div className="videowrapper">
          <ReactPlayer className="videoplayer" playing url='vid/teacher_onboarding_visibility.mp4' light controls volume='0.6' />
        </div>
        <p>How can I add widgets like video calling to my room?</p>
        <div className="videowrapper">
          <ReactPlayer className="videoplayer" playing url='vid/teacher_onboarding_widgets.mp4' light controls volume='0.6' />
        </div>
      </>
    )
  }
  */

  useEffect(() => {
    getAuth();
  }, [user])

  return (
    token === null ? <Redirect to='/' /> : (
      profile.length === 0 ? (<Loading />) : (
        <section className="landing">
          <p>Hello, <strong>{profile.displayname}</strong>.</p>
          <p>Your <strong>/classroom</strong> is a collaborative chat platform where you can find rooms for your courses and classes. Each room can be enhanced with a variety of widgets (think of plugins) like audio/video collaboration or collaborative real-time writing and editing.</p>
          <p>The <strong>/account</strong> section shows your profile information and which rooms you are part of. You will soon be able to accept or reject invites to other rooms in this section.</p>
          <p>You can <strong>/explore</strong> openly accessible public rooms categorized by department, location, and subject … soon we will provide a search function and filtering.</p>
          <p>If you need an openly accessible public room, please <strong>/request</strong> one via the provided form. You can learn more about the differences of public vs. private rooms in our FAQs and video section.</p>
          <p>In case you need some guidance, please check the frequently asked questions in our <strong>/support</strong> section. If the problem you encounter is not documented, yet, please contact us via the provided form below the FAQs.</p>
          <p>In addition to our written documentation, you can visit <strong>/kino</strong> and browse through our collection of introduction and how-to videos.</p>
          <p>You can use <strong>/meet</strong> for audio/video collaboration for your courses and for presenting your work, or simply for talking to each other virtually face to face.</p>
          <p>You can use <strong>/write</strong> for collaborating with others in real-time on the same text document, or you can simply take some notes for only yourself.</p>
          <p>If you want to present your course or project to a large group of people, you can use <strong>/stream</strong> for real-time live streaming audio/video content.</p>
        </section>
      )
    )
  )
}

export default Dashboard;
