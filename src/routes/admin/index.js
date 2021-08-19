import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form' // https://github.com/react-hook-form/react-hook-form
import { Loading } from '../../components/loading'
import Matrix from '../../Matrix'

// import { useAuth } from '../../Auth'

// const auth = useAuth()

const Admin = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [mail, setMail] = useState('')
  const [sending, setSending] = useState(false)
  const [admin, setAdmin] = useState(false)
  const { handleSubmit } = useForm()
  const matrixClient = Matrix.getMatrixClient()

  useEffect(() => {
    const checkAdminPriviliges = async () => {
      setAdmin(await matrixClient.isSynapseAdministrator().catch(console.log))
      console.log(admin ? 'you are a server admin' : 'you are not a server admin')
    }
    checkAdminPriviliges()
  }, [admin, matrixClient])

  const onSubmit = async () => {
    setSending(true)

    fetch(`${process.env.REACT_APP_MEDIENHAUS_BACKEND_API_ENDPOINT}/_synapse/admin/v1/register/`, { method: 'GET' })
      .then(res => res.json())
      .then(console.log)

    const body = {
      password: password,
      displayname: name,
      threepids: [
        {
          medium: 'email',
          address: mail
        }
      ],
      admin: false,
      deactivated: false
    }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
    console.log(body)

    fetch(`${process.env.REACT_APP_MEDIENHAUS_BACKEND_API_ENDPOINT}/_synapse/admin/v2/users/`, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data))
      .then(setSending(false))
  }
  if (!matrixClient) return <Loading />
  if (!admin) return <p>You need admin priviliges to see this page.</p>

  return (
    <>
    <h2>Admin</h2>
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
      <input type="text" value={mail} onChange={(e) => setMail(e.target.value)} />

      <button type="submit" disabled={sending}>SUBMIT</button>
      </form>
      </>
  )
}

export default Admin
