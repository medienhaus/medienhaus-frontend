import React, { useEffect, useState, useContext } from 'react';
import { Redirect, useLocation } from 'react-router-dom'
import { LocationContext } from '../../components/context/LocationContext'
import Profile from "../../components/matrix_profile";
import { Loading } from "../../components/loading/loading";

const Dashboard = () => {
  //const [auth, setAuth] = useContext(AuthProvider);
  const [token, setToken] = useState();
  const [loc, setLoc] = useContext(LocationContext);

  const location = useLocation();

  const getAuth = () => {
    setToken(localStorage.getItem('cr_auth'));
    setLoc(location.pathname);
    //console.log(location.pathname);
  }
  const profile = Profile();

  useEffect(() => {
    getAuth();
  }, [loc])

  return (
    token === null ? <Redirect to='/' /> : (
      profile.length === 0 ? (<Loading />) : (
        <section className="landing">
          <h2>Hello <strong>{profile.displayname}</strong>, you are now logged in.</h2>
          <ul>
            <li><strong><a href="/account">/account</a></strong> your profile and a list of your rooms</li>
            <li><strong><a href="/explore">/explore</a></strong> explore, join, and leave public rooms</li>
            <li><strong><a href="/docs">/docs</a></strong> documentation, how-to and usage guide</li>
            <li><strong><a href="/help">/help</a></strong> frequently asked questions and answers</li>
            <li><strong><a href="/support">/support</a></strong> in case of undocumented problems</li>
            <li><strong><a href="/request">/request</a></strong> openly accessible public rooms</li>
          </ul>
        </section>
      )
    )
  )
}

export default Dashboard;
