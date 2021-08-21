import React, { useEffect, useState } from 'react'
import { Loading } from '../../components/loading'
import Matrix from '../../Matrix'

import AddUser from './components/AddUser'
import ChangePassword from './components/ChangePassword'
import DeleteUser from './components/DeleteUser'

// import { useAuth } from '../../Auth'

// const auth = useAuth()

const Admin = () => {
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState(false)

  const matrixClient = Matrix.getMatrixClient()

  useEffect(() => {
    const checkAdminPriviliges = async () => {
      setLoading(true)
      setAdmin(await matrixClient.isSynapseAdministrator().catch(console.log))
      console.log(admin ? 'you are a server admin' : 'you are not a server admin')
      setLoading(false)
    }
    checkAdminPriviliges()
  }, [admin, matrixClient])

  const renderSelection = () => {
    switch (selection) {
      case 'add':
        return <AddUser />
      case 'password':
        return <ChangePassword />
      case 'delete':
        return <DeleteUser />
      default:
        return <AddUser matrixClient={matrixClient} />
    }
  }

  if (!matrixClient || loading) return <Loading />
  if (!admin) return <p>You need admin priviliges to see this page.</p>
  return (
    <>
        <div id="formchooser">
        <input type="radio" id="add-user" name="add-user" value="add-user" checked={selection === 'add'} onClick={() => setSelection('add')} />
        <label htmlFor="add-user">Add Account</label>
        <input type="radio" id="change-password" name="change-password" value="change-password" checked={selection === 'password'} onClick={() => setSelection('password')} />
        <label htmlFor="change-password">Reset Password</label>
        <input type="radio" id="delete-user" name="delete-user" value="delete-user" checked={selection === 'delete'} onClick={() => setSelection('delete')} />
        <label htmlFor="delete-user">Delete user</label>
      </div>
      {renderSelection()}
  </>
  )
}

export default Admin
