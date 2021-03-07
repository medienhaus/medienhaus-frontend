import React from 'react'
import udk from '../../assets/img/udk-berlin.svg' // with import
import { useTranslation } from 'react-i18next'
/*
import style from './style.css';
*/

const Footer = () => {
  const { t, i18n } = useTranslation(['translation', 'welcome'])

  const changeLanguage = code => {
    localStorage.setItem('cr_lang', code)
    i18n.changeLanguage(code)
  }

  return (
    <footer>
      <p className="copyright">&#x1f12f; 2021 <a href="mailto:info@medienhaus.udk-berlin.de?subject=medienhaus/" rel="nofollow noopener noreferrer"><strong>medienhaus/</strong></a></p>
      <div className="l10n">
        <button onClick={() => changeLanguage('de')}>
          {t('translation:de')}
        </button>
        <span>/</span>
        <button onClick={() => changeLanguage('en')}>
          {t('translation:en')}
        </button>
      </div>
      <img src={udk} alt="Berlin University of the Arts" />
    </footer>
  )
}

export default Footer
