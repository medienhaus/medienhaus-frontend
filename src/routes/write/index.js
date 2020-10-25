import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

const Write = () => {
  const { t } = useTranslation(['translation', 'write']);
  return (
    <section className="write copy">
      <p><Trans i18nKey="write:p0">You can use <strong>/write</strong> for taking notes and sharing them with your group in real time.</Trans></p>
      <p>{t('write:p1')}</p>
      <p>{t('write:p2')}</p>
      <p><Trans i18nKey="write:p3"><strong>/write</strong> can be accessed via: <a href="https://write.medienhaus.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">write.medienhaus.udk-berlin.de</a></Trans> </p>
    </section>
  );
}

export default Write;
