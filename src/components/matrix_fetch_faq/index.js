import { useState, useEffect } from 'react'
import config from '../../config.json'
import fm from 'front-matter'
import { useTranslation } from 'react-i18next'
import Matrix from '../../Matrix'

const fetchMatrix = async (path) => {
  const matrixClient = Matrix.getMatrixClient()
  try {
    const roomId = await matrixClient.getRoomIdForAlias(path)
    const allMessages = config.baseUrl + `/_matrix/client/r0/rooms/${roomId.room_id}/messages?limit=999999&access_token=${localStorage.getItem('mx_access_token')}&dir=b`
    const result = await fetch(allMessages)
    const data = await result.json()
    console.log(data)
    const htmlString = data.chunk.map(type => {
      if (type.type === 'm.room.message' && fm.test(type.content.body) && type.content.msgtype === 'm.text' && type.content['m.new_content'] === undefined) {
        const content = fm(type.content.body)
        const bar = { ...content, ...{ eventId: type.event_id } } // ......sorry
        return bar
      } else if (type.type === 'm.room.message' && type.content.msgtype === 'm.image') {
        const content = fm('![alt text](' + (matrixClient.mxcUrlToHttp(type.content.url, 1080, 640)) + ')')
        const bar = { ...content, ...{ eventId: type.event_id } }
        console.log('image')
        return bar
      } else { return null }
    }
    )
    return htmlString
  } catch (e) {
    console.log('error from fetchFaq API call' + e)
  }
}

const FetchFaq = ({ num }) => {
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(false)
  const [index, setIndex] = useState()
  const [faq, setFaq] = useState([])
  const { i18n } = useTranslation(['translation', 'support'])
  const faqPath = i18n.language === 'en' ? config.faq.en : config.faq.de

  useEffect(() => {
    let canceled
    setFetching(true);
    (async () => {
      try {
        const res = await fetchMatrix(faqPath)
        const text = res.filter(x => x !== null).sort((a, b) => Math.sign(a.attributes.order - b.attributes.order)).map((entry, i) => {
          if (entry !== null) {
            return { body: entry.body, event: entry.eventId, order: entry.attributes.order }
          } else { return null }
        })
        canceled || setFaq(text)
      } catch (e) {
        canceled || setError(e)
      } finally {
        canceled || setFetching(false)
      }
    })()
    return () => { canceled = true }
  }, [index, faqPath])

  return {
    faq,
    error,
    fetching,
    onSave: e => {
      setIndex({
        ...index,
        [num]: num
      })
    }
  }
}
export default FetchFaq
