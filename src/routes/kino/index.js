import React, { useState } from 'react'
import ReactPlayer from 'react-player'

const Kino = () => {
  const [video, setVideo] = useState('../../assets/video/public_onboarding.mp4');
  const [played, setPlayed] = useState(null);
  console.log(ReactPlayer.onProgress)

  const handleProgress = state => {
    setPlayed(state.played);
  }

  return (
    <section className="support">
      <section className="sidebar">
        <button onClick={() => setVideo('../../assets/video/public_onboarding.mp4')}>Getting started</button>
        <button onClick={() => setVideo('../../assets/video/teacher_onboarding_visibility.mp4')}>Public vs. Private rooms</button>
        <button onClick={() => setVideo('../../assets/video/teacher_onboarding_widgets.mp4')}>How to add widgets</button>
      </section>
      <section className="videos">
        <div className="videowrapper">
          <ReactPlayer className="videoplayer" playing url={video} light controls volume='0.6' width='100%' onProgress={handleProgress} />
          <progress max={1} value={played} />
        </div>
      </section>
    </section>
  )
}

export default Kino;