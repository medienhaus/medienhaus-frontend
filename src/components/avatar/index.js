import React from 'react'
import PropTypes from 'prop-types'

import styles from './Avatar.module.css'

const Avatar = ({ url }) => {
  if (!url) return <canvas className={styles.avatarFallback}></canvas>

  return (
    <img className={styles.avatar} src={url} alt="avatar" />
  )
}

Avatar.propTypes = {
  url: PropTypes.string
}

export default Avatar
