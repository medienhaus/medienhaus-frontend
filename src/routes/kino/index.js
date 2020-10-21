import React, { useState } from 'react'
import ReactPlayer from 'react-player'

const Kino = () => {
  const [video, setVideo] = useState('video/public_onboarding.mp4');
  const [played, setPlayed] = useState(null);

  const Button = ({ url, head, sub, }) => {
    return (
      <li>
        <button onClick={() => setVideo(url)} >
          {url === video ? <div className="playicon pause"></div> : <div className="playicon"></div>}
        </button>
        <div>
          <p><em>{head}</em></p>
          <p>{sub}</p>
        </div>
      </li>
    )
  }

  return (
    <section className="kino with-sidebar">
      <div>
        <section className="sidebar">
          <ul>
            <Button url={'video/public_onboarding.mp4'}
              head={'01. The Getting Started Video'}
              sub={['Your first day at', <strong> '/medienhaus'</strong>]}
            />

            <Button url={'video/teacher_onboarding_visibility.mp4'}
              head={'02. Room Visibility and Access'}
              sub={'Public, private, and invite-only'}
            />

            <Button url={'video/teacher_onboarding_widgets.mp4'}
              head={'03. Widgets and Enhancements'}
              sub={['Integrate ', <strong>/meet</strong>, ', ', <strong>/write</strong>, ', ', < strong > /stream</strong >]}
            />
          </ul>
        </section>
        <section className="video">
          <div className="videowrapper">
            <ReactPlayer className="videoplayer" playing controls url={video} light volume='0.6' width='100%' onProgress={(state) => setPlayed(state.played)} />
            <progress max={1} value={played} />
          </div>
        </section>
      </div>
    </section>
  )
}

export default Kino;
