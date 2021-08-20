import React, { useState } from 'react'
import { useForm } from 'react-hook-form' // https://github.com/react-hook-form/react-hook-form
import { Loading } from '../../../components/loading'

const ChangePassword = () => {
  const [response, setResponse] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const { handleSubmit } = useForm()

  const onSubmit = async () => {
    setSending(true)
    const body = {
      new_password: password,
      logout_devices: true
    }
    fetch(`${process.env.REACT_APP_MATRIX_BASE_URL}/_synapse/admin/v1/reset_password/@${name}:${localStorage.getItem('mx_home_server')}`, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('mx_access_token') },
      body: JSON.stringify(body)
    })
      .then(async res => {
        if (res.ok) {
          setName('')
          setPassword('')
          setResponse(`Password for user ${name} was successfully changed.`)
          setTimeout(() => {
            setResponse('')
          }, 2500)
        } else {
          const error = await res.json()
          setResponse('An error occured: ' + error.error)
        }
      })
      .then(setSending(false))
  }
  return (
      <>
    <h2>Change password for a user</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Username: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button type="submit" disabled={sending || !name || !password }>{sending ? <Loading /> : 'SUBMIT'}</button>
      </form>
        {response && <p>{response}</p>}
        </>
  )
}
export default ChangePassword
