import React, { useContext, useEffect, useState } from 'react';
import * as matrixcs from "matrix-js-sdk";
import { NavLink } from "react-router-dom";
import { UserContext } from '../context/UserContext'

/*
const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: 'https://medienhaus.udk-berlin.de',
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true
});*/


const Nav = () => {
  const { user } = useContext(UserContext);
  const [auth, setAuth] = useState(null);
  /*
  const { t, i18n } = useTranslation(['translation', 'welcome']);

  const changeLanguage = code => {
    i18n.changeLanguage(code);
  };
  */

  useEffect(() => {
    setAuth(localStorage.getItem('mx_access_token'))
    // eslint-disable-next-line
  }, [user])

  return (
    <nav>
      <div>
        <div>
          {auth ? (
            <a href="https://medienhaus.udk-berlin.de/classroom" rel="nofollow noopener noreferrer" target="_self">/classroom&nbsp;-&gt;</a>
          ) : (
              <NavLink activeclassname="active" to="/login">/login</NavLink>
            )}
        </div>
        {auth ? (
          <>
            <div>
              <NavLink activeclassname="active" to="/account">/account</NavLink>
              <NavLink activeclassname="active" to="/explore">/explore</NavLink>
              <NavLink activeclassname="active" to="/request">/request</NavLink>
              <NavLink activeclassname="active" to="/support">/support</NavLink>
              <NavLink activeclassname="active" to="/kino">/kino</NavLink>
              {//<NavLink activeclassname="active" to="/admin">/admin</NavLink>}
                //matrixClient.isSynapseAdministrator() ?? console.log('with great power comes great responsibility')
              }

            </div>
            <div>
              <NavLink activeclassname="active" to="/meet">/meet</NavLink>
              <NavLink activeclassname="active" to="/write">/write</NavLink>
              <NavLink activeclassname="active" to="/stream">/stream</NavLink>
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
