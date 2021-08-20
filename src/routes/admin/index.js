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

  const matrixClient = Matrix.getMatrixClient()

  useEffect(() => {
    const checkAdminPriviliges = async () => {
      setAdmin(await matrixClient.isSynapseAdministrator().catch(console.log))
      console.log(admin ? 'you are a server admin' : 'you are not a server admin')
    }
    checkAdminPriviliges()
  }, [admin, matrixClient])

  if (!matrixClient) return <Loading />
  if (!admin) return <p>You need admin priviliges to see this page.</p>

  return (
    <>
      <AddUser matrixClient={matrixClient}/>
      <ChangePassword/>
      <DeleteUser />
  </>
  )
}

export default Admin
