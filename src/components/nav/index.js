import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../Auth'
import config from '../../config.json'

const Nav = () => {
  const auth = useAuth()

  if (auth.user === null) {
    return null
  }

  return (
    <nav>
      <div>
        <div>
          {auth.user
            ? (
            <a href={config.baseUrl + '/classroom'} rel="nofollow noopener noreferrer" target="_self">/classroom&nbsp;-&gt;</a>
              )
            : (
            <NavLink activeclassname="active" to="/login">/login</NavLink>
              )}
        </div>
        {auth.user && (
          <>
            <div>
              <NavLink activeclassname="active" to="/account">/account</NavLink>
              <NavLink activeclassname="active" to="/explore">/explore</NavLink>
              <NavLink activeclassname="active" to="/request">/request</NavLink>
              <NavLink activeclassname="active" to="/support">/support</NavLink>
              <NavLink activeclassname="active" to="/kino">/kino</NavLink>
              <NavLink activeclassname="active" to="/admin">/admin</NavLink>
              {
                // <NavLink activeclassname="active" to="/admin">/admin</NavLink>}
                // matrixClient.isSynapseAdministrator() ?? console.log('with great power comes great responsibility')
              }
            </div>
            <div>
              <NavLink activeclassname="active" to="/meet">/meet</NavLink>
              <NavLink activeclassname="active" to="/write">/write</NavLink>
              <NavLink activeclassname="active" to="/stream">/stream</NavLink>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav
