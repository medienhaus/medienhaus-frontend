import React from 'react'
import i18n from 'i18next'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../Auth'
import config from '../../config.json'

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
              <a href={config.element.href} rel="nofollow noopener noreferrer" target="_self">{config.element.label}&nbsp;-&gt;</a>
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
                {config.navigation.outgoingLinks.map((service, index) => (
                  <a href={service.url} rel="external nofollow noopener noreferrer" target="_blank" key={index}>{service.label}</a>
                ))}
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
