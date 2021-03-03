import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Matrix from '../../Matrix'

const usePublicRooms = () => {
  const [answer, setAnswer] = useState([])
  const history = useHistory()

  const matrixClient = Matrix.getMatrixClient()

  const getAnswer = async () => {
    try {
      const answer = await matrixClient.publicRooms()
      setAnswer(answer.chunk)
    } catch (e) {
      if (e.data.error === 'Unrecognised access token') {
        alert('Oops something went wrong! Please try logging in again')
        localStorage.clear()
        return history.push('/login')
      } else if (e.data.error === 'Invalid macaroon passed.') {
        alert('Oops something went wrong! Please try loggin in again')
        localStorage.clear()
        return history.push('/login')
      }
      console.log(e.data.error)
    }
  }
  useEffect(() => {
    getAnswer()
    // eslint-disable-next-line
  }, []);

  return answer
}

export default usePublicRooms
