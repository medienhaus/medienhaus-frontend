import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { Loading } from '../../components/loading'
import PropTypes from 'prop-types'

const JoinLeaveButton = ({ id, isPartOfRoom, onJoin, onLeave }) => {
  const { t } = useTranslation('explore')
  const [loading, setLoading] = useState(false)
  const onClick = () => {
    if (loading) return

    setLoading(true)
    let promise

    if (isPartOfRoom) {
      // leave
      promise = onLeave
    } else {
      // join
      promise = onJoin
    }

    promise(id).finally(() => {
      setLoading(false)
    })
  }

  return isPartOfRoom
    ? <button disabled={loading} onClick={onClick} name="Leave">{loading ? <Loading/> : t('LEAVE')}</button>
    : <button disabled={loading} onClick={onClick} name="Join">{loading ? <Loading/> : t('JOIN')}</button>
}

JoinLeaveButton.propTypes = {
  id: PropTypes.string.isRequired,
  isPartOfRoom: PropTypes.bool.isRequired,
  onJoin: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired
}

export default JoinLeaveButton
