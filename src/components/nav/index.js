import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../Auth'
import ReactMarkdown from 'react-markdown' // https://github.com/remarkjs/react-markdown
import FetchCms from '../../components/matrix_fetch_cms'
import config from '../../config.json'

const Nav = () => {
  const auth = useAuth()
  const path = config.nav
  const { cms, error, fetching } = FetchCms(path, false)

  if (auth.user === null) {
    return null
  }

  return (
    <nav>
      <div>
        <div>
          {auth.user
            ? (
            <a href="https://medienhaus.udk-berlin.de/classroom" rel="nofollow noopener noreferrer" target="_self">/classroom&nbsp;-&gt;</a>
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
              {fetching ? error ? console.log('error while fetching: ' + error) : 'loading...' : cms.map((entry, index) => <NavLink key={'nav' + index} activeclassname="active" to="/meet"><ReactMarkdown key={index} source={entry.body} /></NavLink>)}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav
