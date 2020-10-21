import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { UserContext } from '../context/UserContext'

const Nav = () => {
  const { user } = useContext(UserContext);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(localStorage.getItem('mx_access_token'))
    // eslint-disable-next-line
  }, [user])

  return (
    <nav>
      <div>
        <div>
          {auth ? (
            <a activeClassName="active" href="https://medienhaus.udk-berlin.de/classroom" target="_self" rel="noopener noreferrer">/classroom&nbsp;-&gt;</a>
          ) : (
            <NavLink activeClassName="active" to="/login">login</NavLink>
          )}
        </div>
        {auth ? (
          <>
            <div>
              <NavLink activeClassName="active" to="/account">/account</NavLink>
              <NavLink activeClassName="active" to="/explore">/explore</NavLink>
              <NavLink activeClassName="active" to="/request">/request</NavLink>
              <NavLink activeClassName="active" to="/support">/support</NavLink>
              <NavLink activeClassName="active" to="/kino">/kino</NavLink>
            </div>
            <div>
              <NavLink activeClassName="active" to="/meet">/meet</NavLink>
              <NavLink activeClassName="active" to="/write">/write</NavLink>
              <NavLink activeClassName="active" to="/stream">/stream</NavLink>
            </div>
          </>
        ) : (
            null
          )
        }
      </div>
    </nav>
  )
};

export default Nav;
