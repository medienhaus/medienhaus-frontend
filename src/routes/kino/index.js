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
    <section className="support">
      <section className="videos">
        <div className="videowrapper">
          <ReactPlayer className="videoplayer" playing url={video} light controls volume='0.6' width='100%' onProgress={handleProgress} />
          <progress max={1} value={played} />
        </div>
      </section>
      <section className="sidebar">
        <ul>
          <li><button onClick={() => setVideo('video/public_onboarding.mp4')}><div className="playicon"></div></button> <span>Getting Started &ndash; Your First Day at <strong>medienhaus/</strong></span></li>
          <li><button onClick={() => setVideo('video/teacher_onboarding_visibility.mp4')}><div className="playicon"></div></button> <span>Room Visibility &ndash; Public vs. Private Rooms</span></li>
          <li><button onClick={() => setVideo('video/teacher_onboarding_widgets.mp4')}><div className="playicon"></div></button> <span>Widgets &ndash; Integrate audio/video chat or collaborative writing</span></li>
        </ul>
      </section>
    </section>
  )
}

export default Kino;