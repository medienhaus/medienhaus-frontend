import React, { useState } from 'react'
import ReactPlayer from 'react-player'

const Kino = () => {
  const [video, setVideo] = useState([
    { src: 'video/public_onboarding.mp4', type: 'video/mp4' },
    { src: 'video/public_onboarding.webm', type: 'video/webm' }
  ]);
  const [played, setPlayed] = useState(null);

  const Button = ({ url, head, sub }) => {
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

  return (
    <section className="kino with-sidebar">
      <div>
        <section className="video">
          <div className="videowrapper">
            <ReactPlayer className="videoplayer" playing controls url={video} light volume={0.6} width='100%' onProgress={(state) => setPlayed(state.played)} />
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
              sub={['Your first day at', <strong key={'medienhaus'}> /medienhaus</strong>]}
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
              sub={['Integrate ', <strong key={'meet'}>/meet</strong>, ', ', <strong key={'weite'}>/write</strong>, ', ', < strong key={'stream'} > /stream</strong >]}
            />
          </ul>
        </section>
      </div>
    </section>
  )
}

export default Kino;
