import React from 'react'
import i18n from 'i18next'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../Auth'

const Nav = () => {
  const auth = useAuth()

  const changeLanguage = code => {
    localStorage.setItem('cr_lang', code)
    i18n.changeLanguage(code)
  }

  if (auth.user === null) {
    return null
  }

  return (
    <>
      <nav>
        <div>
          <div>
            {auth.user
              ? (
              <a href={process.env.REACT_APP_MATRIX_BASE_URL + '/classroom'} rel="nofollow noopener noreferrer" target="_self">/classroom&nbsp;-&gt;</a>
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
                <a href="https://write.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">/write</a>
                <a href="https://stream.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">/stream</a>
              </div>
            </>
          )}
        </div>
      </nav>
      <section>
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('de')}>DE</button>
      </section>
    </>
  )
}

export default Nav
