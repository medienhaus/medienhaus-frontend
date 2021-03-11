import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

const Landing = () => {
  const { t } = useTranslation(['landing'])

  return (
    <>
      <section id="definition">
        <blockquote><Trans t={t} i18nKey="definition"><em>classroom, n.</em> — shared space to <strong>communicate</strong> and exchange, <strong>meet</strong> face to face, <strong>present</strong> to each other, and <strong>study</strong> together.</Trans></blockquote>
      </section>
      <section id="introduction" className="copy">
        <p><Trans t={t} i18nKey="introduction">
          <a href="https://www.udk-berlin.de/en/university/college-of-architecture-media-and-design/medienhaus/" rel="nofollow noreferrer noopener" target="_blank">Medienhaus</a> is the media design and art department of Berlin University of the Arts; it is an experimental playground shared amongst Visual Communication, Art and Media, and Communication in Social and Economic Contexts.
        </Trans></p>
        <p><Trans t={t} i18nKey="intro1">As the COVID-19 pandemic happened, we quickly needed to provide an intuitive remote collaboration platform, satisfying the requirements and needs of an art school during this crisis and beyond.</Trans></p>
        <p><Trans t={t} i18nKey="intro2">We rapidly prototyped and iteratively enhanced a privacy-focused, free and open-source set of tools and services for our students and staff. Please feel free to log in with your udk account.</Trans></p>
      </section>
      <section id="shoutout">
        <blockquote><Trans t={t} i18nKey="shoutout">
          We developed <strong>medienhaus/</strong> — not replacing but extending the name-giving physical space.
        </Trans></blockquote>
      </section>
      <section id="services">
        <ul>
          <li><Trans t={t} i18nKey="classroom"><strong>/classroom</strong> asynchronous communication space</Trans></li>
          <li><Trans t={t} i18nKey="meet"><strong>/meet</strong> audio/video collaboration and presentation</Trans></li>
          <li><Trans t={t} i18nKey="write"><strong>/write</strong> collaborative writing, reading, and editing</Trans></li>
          <li><Trans t={t} i18nKey="stream"><strong>/stream</strong> audio/video live streaming and playback</Trans></li>
        </ul>
      </section>
    </>
  )
}
/*
<section id="team">
        <h2><strong>Team</strong> (sorted alphabetically):</h2>
        <ul>
          <li>Alexej Bormatenkow</li>
          <li>Dirk Erdmann</li>
          <li><a href="mailto:kg@udk-berlin.de?subject=medienhaus/" rel="external nofollow noreferrer">Klaus Gasteier</a></li>
          <li>Marcel Haupt</li>
          <li><a href="mailto:dh@udk-berlin.de?subject=medienhaus/" rel="external nofollow noreferrer">Daniel Hromada</a></li>
          <li>Frederik Müller</li>
          <li>Andi Rueckel</li>
          <li>Merani Schilcher</li>
          <li><a href="mailto:rfws@udk-berlin.de?subject=medienhaus/" rel="external nofollow noreferrer">Robert Schnüll</a></li>
          <li>Paul Seidler</li>
        </ul>
      </section>
*/

export default Landing
