import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../context/UserContext'
/*
import style from './style.css';
*/
const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(localStorage.getItem('cr_auth'))
    // eslint-disable-next-line
  }, [user])

  return (
    <header>
      <Link activeclassname="active" to="/">
        <h1>medienhaus/</h1>
      </Link>
      {auth ? (
        <nav>
          <Link activeclassname="active" to="/account">account</Link>
          <Link activeclassname="active" to="/explore">explore</Link>
          <Link activeclassname="active" to="/support">support</Link>

        </nav>
      ) : (
          null
        )
      }
      {auth ? <a activeclassname="active" href="https://medienhaus.udk-berlin.de/classroom" target="_blank" rel="noopener noreferrer">/classroom&nbsp;-&gt;</a> : <Link activeclassname="active" to="/login">login</Link>}
    </header>
  )
};

export default Header;
