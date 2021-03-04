import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../Auth'
import config from '../../config.json'
import FetchCms from '../../components/matrix_fetch_cms'

const Nav = () => {
  const auth = useAuth()
  const { cms, error, fetching } = FetchCms(config.nav, false)

  !error ?? console.log('error while fetching nav: ' + error)

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
              {fetching ? null : cms.map((entry, index) => <NavLink key={index} activeclassname="active" to={entry.link}>{entry.body}</NavLink>)}
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
