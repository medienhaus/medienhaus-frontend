import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
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
            <a activeclassname="active" href="https://medienhaus.udk-berlin.de/classroom" target="_self" rel="noopener noreferrer">/classroom&nbsp;-&gt;</a>
          ) : (
            <Link activeclassname="active" to="/login">login</Link>
          )}
        </div>
        {auth ? (
          <>
            <div>
              <Link activeclassname="active" to="/account">/account</Link>
              <Link activeclassname="active" to="/explore">/explore</Link>
              <Link activeclassname="active" to="/support">/support</Link>
              <Link activeclassname="active" to="/request">/request</Link>
            </div>
            <div>
              <Link activeclassname="active" to="/meet">/meet</Link>
              <Link activeclassname="active" to="/write">/write</Link>
              <Link activeclassname="active" to="/stream">/stream</Link>
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
