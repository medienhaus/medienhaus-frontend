import React, { useState } from 'react'
import JsSHA from 'jssha'
import { useForm } from 'react-hook-form' // https://github.com/react-hook-form/react-hook-form
import { Loading } from '../../../components/loading'

const AddUser = ({ matrixClient }) => {
  const [response, setResponse] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [mail, setMail] = useState('')
  const [admin, setAdmin] = useState(false)
  const [sending, setSending] = useState(false)
  const { handleSubmit } = useForm()

  const onSubmit = async () => {
    setSending(true)

    /*
    const sendEmail = () => {
      try {
        matrixClient.requestPasswordEmailToken(mail, Math.random().toString(16).substr(2, 16), 0)
      } catch (err) {
        console.log(err)
      }
    }
    */

    fetch(`${process.env.REACT_APP_MATRIX_BASE_URL}/_synapse/admin/v1/register/`, { method: 'GET' })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        const shaObj = new JsSHA('SHA-1', 'TEXT', {
          hmacKey: { value: process.env.REACT_APP_DEV_SHARED_SECRET, format: 'TEXT' }
        })
        shaObj.update(res.nonce)
        shaObj.update('\0')
        shaObj.update(name)
        shaObj.update('\0')
        shaObj.update(password)
        shaObj.update('\0')
        shaObj.update(admin ? 'admin' : 'notadmin')
        const hmac = shaObj.getHash('HEX')

        const body = {
          nonce: res.nonce,
          username: name,
          displayname: name,
          password: password,
          admin: admin,
          mac: hmac
        }

        fetch(`${process.env.REACT_APP_MATRIX_BASE_URL}/_synapse/admin/v1/register/`, {
          method: 'POST',
          body: JSON.stringify(body)
        })
          .then(async res => {
            if (res.ok) {
              setName('')
              setMail('')
              setPassword('')
              setResponse(`User ${name} was successfully created. An e-mail has been sent to: ${mail}`)
              setTimeout(() => {
                setResponse('')
              }, 2500)
            } else {
              const error = await res.json()
              setResponse('An error occured: ' + error.error)
            }
          })
          .then(setSending(false))
      })
  }
  return (
    <>
      <h2>Add user</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Username: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <label htmlFor="mail">E-Mail: </label>
        {/* eslint-disable-next-line no-useless-escape */}
        <input type="text" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="email" />
        <div>
          <label htmlFor="checkbox">Make user admin: </label>
            <input type="checkbox" id="checkbox" name="checkbox" value={admin} onChange={() => setAdmin(!admin)} checked={admin === true} />
        </div>
        <button type="submit" disabled={sending || !name || !password || !mail}>{sending ? <Loading /> : 'SUBMIT'}</button>
      </form>

      {response && <p>{response}</p>}
    </>
  )
}
export default AddUser
