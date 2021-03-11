import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../Auth'
import Matrix from '../../Matrix'
import ReactMarkdown from 'react-markdown' // https://github.com/remarkjs/react-markdown
import FetchCms from '../../components/matrix_fetch_cms'
import config from '../../config.json'

const Nav = () => {
  const auth = useAuth()
  const matrixClient = Matrix.getMatrixClient()
  const [admin, setAdmin] = useState(false)
  const path = config.nav
  const { cms, error, fetching } = FetchCms(path, false)

  useEffect(() => {
    adminPanel()
  }, [])

  const adminPanel = async () => {
    try {
      const roomId = await matrixClient.getRoomIdForAlias(config.admin)
      const members = await matrixClient.getJoinedRoomMembers(roomId.room_id)
      setAdmin(JSON.stringify(members).includes(localStorage.getItem('mx_user_id')))
    } catch (e) {
      console.log('error while checking members: ' + e)
    }
  }

  if (auth.user === null) {
    return null
  }

  return (
    <nav>
      <div>
        <div>
          {auth.user
            ? (
              <a href={ config.baseUrl + '/classroom' }rel="nofollow noopener noreferrer" target="_self">/classroom&nbsp;-&gt;</a>
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
              {admin ? <NavLink activeclassname="active" to="/admin">/admin</NavLink> : null }
              {
                // <NavLink activeclassname="active" to="/admin">/admin</NavLink>}
                // matrixClient.isSynapseAdministrator() ?? console.log('with great power comes great responsibility')
              }
            </div>
            <div>
              {fetching
                ? error
                  ? console.log('error while fetching: ' + error)
                  : 'loading...'
                : cms.map((entry, index) => <ReactMarkdown key={index} disallowedTypes={['paragraph']}unwrapDisallowed source={entry.body} />)}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav
