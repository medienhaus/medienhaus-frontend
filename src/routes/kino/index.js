import React, { useState } from 'react'
import ReactPlayer from 'react-player'

const Kino = () => {
  const [video, setVideo] = useState('video/public_onboarding.mp4');
  const [played, setPlayed] = useState(null);
  console.log(ReactPlayer.onProgress)

  const handleProgress = state => {
    setPlayed(state.played);
  }

  return (
    <section className="kino with-sidebar">
      <div>
        <section className="sidebar">
          <ul>
            <li>
              <button onClick={() => setVideo('video/public_onboarding.mp4')}>
                <div className="playicon"></div>
              </button>
              <div>
                <p><em>01. The Getting Started Video</em></p>
                <p>Your first day at <strong>medienhaus/</strong></p>
              </div>
            </li>
            <li>
              <button onClick={() => setVideo('video/teacher_onboarding_visibility.mp4')}>
                <div className="playicon"></div>
              </button>
              <div>
                <p><em>02. Room Visibility and Access</em></p>
                <p>Public, private, and invite-only</p>
              </div>
            </li>
            <li>
              <button onClick={() => setVideo('video/teacher_onboarding_widgets.mp4')}>
                <div className="playicon"></div>
              </button>
              <div>
                <p><em>03. Widgets and Enhancements</em></p>
                <p>Integrate <strong>/meet</strong>, <strong>/write</strong>, <strong>/stream</strong></p>
              </div>
            </li>
          </ul>
        </section>
        <section className="video">
          <div className="videowrapper">
            <ReactPlayer className="videoplayer" playing url={video} light controls volume='0.6' width='100%' onProgress={handleProgress} />
            <progress max={1} value={played} />
          </div>
        </section>
      </div>
    </section>
  )
}

export default Kino;