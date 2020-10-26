import React, { useState } from 'react'
import ReactPlayer from 'react-player'

const Videos = () => {
  const [video, setVideo] = useState('vid/public_onboarding.mp4');
  const [played, setPlayed] = useState(null);

  const handleProgress = state => {
    setPlayed(state.played);
  }

  return (
    <section>
      <button onClick={() => setVideo('vid/public_onboarding.mp4')}>Getting started</button>
      <button onClick={() => setVideo('vid/teacher_onboarding_visibility.mp4')}>Public vs. Private rooms</button>
      <button onClick={() => setVideo('vid/teacher_onboarding_widgets.mp4')}>How to add widgets</button>
      <div className="wrapper">
        <ReactPlayer className="videoplayer" playing url={video} light controls volume='0.6' width='100%' onProgress={handleProgress} />
        <progress max={1} value={played} />
      </div>
    </section>
  )
}

export const Kino = () => {

  return (<Videos />)
}