import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../context/UserContext'

const Header = () => {
  const { user } = useContext(UserContext);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(localStorage.getItem('mx_access_token'))
    // eslint-disable-next-line
  }, [user])

  return (
    <header>
      { auth ? (
        <Link to="/dashboard">
          <h1>medienhaus/</h1>
        </Link>
      ) : (
        <Link to="/">
          <h1>medienhaus/</h1>
        </Link>
      )}
    </header>
  )
};

export default Header;
