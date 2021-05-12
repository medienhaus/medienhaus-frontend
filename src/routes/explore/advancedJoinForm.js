import React from 'react'
import { Loading } from '../../components/loading'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

const AdvancedJoinForm = (props) => {
  const { register, handleSubmit, errors, reset } = useForm()
  const { t } = useTranslation('explore')

  const onSubmit = (data) => {
    props.submit(data).then(() => {
      reset()
    })
  }

  return (
    <form id="advanced" onSubmit={handleSubmit(onSubmit)}>
      <p>{t('Join room directly')}:</p>
      <div>
        <label htmlFor="room">{t('Room')}: </label>
        <input type="text" name="advancedRoom" placeholder="events" ref={register({ required: true })}/>
      </div>
      {errors.advancedRoom && t('Please enter the name of your room.')}
      <div>
        <label htmlFor="server">{t('Server')}: </label>
        <input type="text" name="advancedServer" placeholder="klasseklima.org" ref={register({ required: true })}/>
      </div>
      {errors.advancedServer && t('Please enter the name of your server.')}
      <button type="submit" name="Join">{props.loading ? <Loading/> : t('JOIN')}</button>
    </form>
  )
}

AdvancedJoinForm.propTypes = {
  submit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default AdvancedJoinForm
