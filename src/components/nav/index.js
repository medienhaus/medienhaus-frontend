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
              {
                // <NavLink activeclassname="active" to="/admin">/admin</NavLink>}
                // matrixClient.isSynapseAdministrator() ?? console.log('with great power comes great responsibility')
              }
            </div>
            <div>
              <a href="https://meetings.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">/meet</a>
              <a href="https://write.medienhaus.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">/write</a>
              <a href="https://stream.medienhaus.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">/stream</a>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav
