import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import * as PropTypes from 'prop-types'

const Kino = () => {
  const [video, setVideo] = useState([
    { src: 'video/public_onboarding.mp4', type: 'video/mp4' },
    { src: 'video/public_onboarding.webm', type: 'video/webm' }
  ])
  const [played, setPlayed] = useState(null)

  const Button = ({ url, head, sub }) => {
    console.log(Object.entries(video))
    console.log('url: ' + url)
    return (
      <li>
        <button onClick={() => setVideo(url)} >
          {url === video ? <div className="playicon playing"></div> : <div className="playicon"></div>}
        </button>
        <div>
          <p>{head}</p>
          <p>{sub}</p>
        </div>
      </li>
    )
  }

  Button.propTypes = {
    url: PropTypes.array.isRequired,
    head: PropTypes.element,
    sub: PropTypes.element
  }

  return (
    <section className="kino with-sidebar">
      <div>
        <section className="video">
          <div className="videowrapper">
            <ReactPlayer className="videoplayer" playing controls url={video} light volume={0.6} width="100%" onProgress={(state) => setPlayed(state.played)} />
            <progress max={1} value={played} />
          </div>
        </section>
        <section className="sidebar">
          <ul>
            <Button
              url={[
                { src: 'video/public_onboarding.mp4', type: 'video/mp4' },
                { src: 'video/public_onboarding.webm', type: 'video/webm' }
              ]}
              head={'01. The Getting Started Video'}
              sub={['Your first day at ', <strong key={'medienhaus'}>/medienhaus</strong>]}
            />

            <Button
              url={[
                { src: 'video/teacher_onboarding_visibility.mp4', type: 'video/mp4' },
                { src: 'video/teacher_onboarding_visibility.webm', type: 'video/webm' }
              ]}
              head={'02. Room Visibility and Access'}
              sub={'Public, private, and invite-only'}
            />

            <Button
              url={[
                { src: 'video/teacher_onboarding_widgets.mp4', type: 'video/mp4' },
                { src: 'video/teacher_onboarding_widgets.webm', type: 'video/webm' }
              ]}
              head={'03. Widgets and Enhancements'}
              sub={['Integrate ', <strong key={'meet'}>/meet</strong>, ', ', <strong key={'write'}>/write</strong>, ', ', <strong key={'stream'}>/stream</strong>]}
            />
            <Button
              url={[
                { src: 'video/stream_introduction.mp4', type: 'video/mp4' },
                { src: 'video/stream_introduction.webm', type: 'video/webm' }
              ]}
              head={['04. Introduction to ', <strong key={'stream'}>/stream</strong>]}
              sub={'Setting up your first live stream'}
            />
          </ul>
        </section>
      </div>
    </section>
  )
}

export default Kino
