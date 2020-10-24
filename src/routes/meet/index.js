import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

const Meet = () => {
  const { t, i18n } = useTranslation(['translation', 'meet']);

  return (
    <section className="meet copy">

      <p>
        <Trans i18nKey="meet:p0">You can use <strong>/meet</strong> for audio/video collaboration in courses and online presentations. It comes with useful functions to present your work or split the course in breakout rooms for focused sessions.
        </Trans></p>
      <p>{t('meet:p1')}</p>
      <p>{t('meet:p2')}</p>
      <p>{t('meet:p3')}</p >
      <p>{t('meet:p4')}</p >
      <p><Trans i18nKey="meet:p5"><strong>/meet</strong> can be accessed via: <a href="https://bbb.medienhaus.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">bbb.medienhaus.udk-berlin.de</a></Trans></p >

    </section >
  );
}

export default Meet;
