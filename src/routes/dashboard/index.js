import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../Auth'
import config from '../../config.json'
import FetchCms from '../../components/matrix_fetch_cms'
import { Loading } from '../../components/loading'
import ReactMarkdown from 'react-markdown' // https://github.com/remarkjs/react-markdown

const Dashboard = () => {
  const auth = useAuth()
  const { t, i18n } = useTranslation(['translation', 'dashboard'])
  const path = i18n.language === 'en' ? config.dashboard.en : config.dashboard.de
  const { cms, error, fetching } = FetchCms(path, false)

  !error ?? console.log('error while fetching content: ' + error)

  return (
    <section className="dashboard copy">
      <p>{t('dashboard:hello')}, <strong>{auth.user.displayname}</strong>.</p>
      {fetching ? <Loading /> : cms.map((p, index) => <ReactMarkdown key={index} source={p.body} />)}
      </section>
  )
}

export default Dashboard
