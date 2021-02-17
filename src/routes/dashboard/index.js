import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useAuth } from '../../Auth'

const Dashboard = () => {
  const auth = useAuth()
  const { t } = useTranslation(['translation', 'dashboard'])

  return (
    <section className="dashboard copy">
      <p>{t('dashboard:hello')}, <strong>{auth.user.displayname}</strong>.</p>
      <p><Trans i18nKey="dashboard:p1">Your <strong>/classroom</strong> is a collaborative chat platform where you can find rooms for your courses and classes. Each room can be enhanced with a variety of widgets (think of plugins) like audio/video collaboration or collaborative real-time writing and editing.</Trans></p>
      <p><Trans i18nKey="dashboard:p2">The <strong>/account</strong> section shows your profile information and which rooms you are part of. You will soon be able to accept or reject invites to other rooms in this section.</Trans></p>
      <p><Trans i18nKey="dashboard:p3">You can <strong>/explore</strong> openly accessible public rooms categorized by department, location, and subject … soon we will provide a search function and filtering.</Trans></p>
      <p><Trans i18nKey="dashboard:p4">If you need an openly accessible public room, please <strong>/request</strong> one via the provided form. You can learn more about the differences of public vs. private rooms in our FAQs and video section.</Trans></p>
      <p><Trans i18nKey="dashboard:p5">In case you need some guidance, please check the frequently asked questions in our <strong>/support</strong> section. If the problem you encounter is not documented, yet, please contact us via the provided form below the FAQs.</Trans></p>
      <p><Trans i18nKey="dashboard:p6">In addition to our written documentation, you can visit <strong>/kino</strong> and browse through our collection of introduction and how-to videos.</Trans></p>
      <p><Trans i18nKey="dashboard:p7">You can use <strong>/meet</strong> for audio/video collaboration for your courses and for presenting your work, or simply for talking to each other virtually face to face.</Trans></p>
      <p><Trans i18nKey="dashboard:p8">You can use <strong>/write</strong> for collaborating with others in real-time on the same text document, or you can simply take some notes for only yourself.</Trans></p>
      <p><Trans i18nKey="dashboard:p9">If you want to present your course or project to a large group of people, you can use <strong>/stream</strong> for real-time live streaming audio/video content.</Trans></p>
    </section>
  )
}

export default Dashboard
