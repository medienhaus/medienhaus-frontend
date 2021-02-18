import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../Auth'
import { Loading } from '../../components/loading'

const Login = () => {
  const { register, handleSubmit, errors } = useForm()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslation(['login'])

  const auth = useAuth()

  const { from } = location.state || { from: { pathname: '/dashboard' } }

  const onSubmit = () => {
    if (isLoading) { return }

    setLoading(true)

    auth.signin(name, password, () => {
      setLoading(false)
      history.replace(from)
    }).catch((error) => {
      alert(error.data.error)
      setLoading(false)
    })
  }

  const changeName = e => setName(e.target.value)
  const changePassword = e => setPassword(e.target.value)

  if (auth.user) {
    return <Redirect to={'/dashboard'} />
  }

  return (
    <section id="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">{t('username')}:</label>
          <input name="username" type="text" placeholder={t('u.name')} value={name} onChange={changeName} ref={register({ required: true })} />

        </div>
        {errors.username && t('Username can\'t be empty.')}
        <div>
          <label htmlFor="password">{t('password')}:</label>
          <input name="password" type="password" placeholder="" value={password} onChange={changePassword} ref={register({ required: true })} />
        </div>
        {errors.password && t('Password can\'t be empty.')}
        {isLoading
          ? (
          <Loading />
            )
          : (
          <button name="submit" type="submit">LOGIN</button>
            )}
      </form>
      <ul>
        <li><a href="https://www.oase.udk-berlin.de/udk-oase-nutzeraccount/" rel="external noopener noreferrer">
          {t('Which account do I need?')}
        </a></li>
        <li><a href="https://www.oase.udk-berlin.de/passwort" rel="external noopener noreferrer">
          {t('I forgot my username/password!')}
        </a></li>
        <li><a href="mailto:info@medienhaus.udk-berlin.de?subject=medienhaus/help" rel="external noopener noreferrer">
          {t('I cannot log in!')}
        </a></li>
      </ul>
    </section>
  )
}

export default Login
