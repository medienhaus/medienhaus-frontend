import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { user } = useContext(UserContext);
  const [auth, setAuth] = useState(null);
  const { t, i18n } = useTranslation(['translation', 'welcome']);

  const changeLanguage = code => {
    i18n.changeLanguage(code);
  };


  useEffect(() => {
    setAuth(localStorage.getItem('mx_access_token'))
    // eslint-disable-next-line
  }, [user])

  return (
    <header>
      { auth ? (
        <>
          <button type="button" onClick={() => changeLanguage('de')}>
            {t('translation:de')}
          </button>

          <button type="button" onClick={() => changeLanguage('en')}>
            {t('translation:en')}
          </button>
          <Link to="/dashboard">

            <h1>medienhaus/</h1>
          </Link>
        </>
      ) : (
          <Link to="/">
            <h1>medienhaus/</h1>
          </Link>
        )}
    </header>
  )
};

export default Header;
