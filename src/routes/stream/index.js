import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

const Stream = () => {
  const { t } = useTranslation(['translation', 'stream']);
  return (
    <section className="stream copy">
      <p><Trans i18nKey="stream:p0">You can use <strong>/stream</strong> for broadcasting your video (a webcam or your desktop) and audio (your voice via microphone or your music for example) to the internet.</Trans></p>
      <p><Trans i18nKey="stream:p1">Live streaming is different than <strong>/meet</strong> in the fact that you can stream to an unlimited amount of people who just tune in to your stream with a link.</Trans></p>
      <p>{t('stream:p2')}</p>
      <p><Trans i18nKey="stream:p3"><strong>/stream</strong> can be accessed via: <a href="https://stream.medienhaus.udk-berlin.de" rel="external nofollow noopener noreferrer" target="_blank">stream.medienhaus.udk-berlin.de</a></Trans></p>
    </section>
  );
}

export default Stream;
