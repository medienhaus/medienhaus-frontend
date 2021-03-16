import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown' // https://github.com/remarkjs/react-markdown
import { useForm } from 'react-hook-form' // https://github.com/react-hook-form/react-hook-form
import { Loading } from '../../components/loading'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../Auth'

const Support = () => {
  const { register, handleSubmit, errors } = useForm()
  const [msg, setMsg] = useState('')
  const [mail, setMail] = useState('')
  const [system, setSystem] = useState()
  const [browser, setBrowser] = useState()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const { t, i18n } = useTranslation('support')

  const auth = useAuth()
  const profile = auth.user

  const changeMsg = e => setMsg(e.target.value)
  const changeMail = e => setMail(e.target.value)
  const changeBrowser = e => setBrowser(e.target.value)
  const changeSystem = e => setSystem(e.target.value)
  const faqPath = i18n.language === 'en' ? require('../../assets/data/support/support_en.md').default : require('../../assets/data/support/support_de.md').default

  const [markdown, setMarkdown] = useState()

  useEffect(() => {
    setLoading(true)
    fetch(faqPath)
      .then((response) => response.text())
      .then((text) => setMarkdown(text))
      .then(() => setLoading(false))
  }, [faqPath, i18n.language])

  const onSubmit = async () => {
    setSending(true)
    const support =
      {
        displayname: profile.displayname,
        mail: mail,
        browser: browser,
        system: system,
        msg: msg
      }
    try {
      const url = 'http://localhost:3001/messenger/support'
      const requestMetadata = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(support)
      }

      fetch(url, requestMetadata)
        .then(res => res.json())
        .then(msg => {
          console.log(msg)
        })
      alert('Your message has ben sent! We will get back to you asap …')
      setSending(false)
      setMail('')
      setMsg('')
      setSystem('')
    } catch (e) {
      console.log(e)
      alert('Couldn’t send your message. Please check your internet connection.')
      setSending(false)
    }
  }

  if (loading) return <Loading />

  return (
    <>
      <section className="faq">
        <ReactMarkdown source={markdown} />
      </section>
      <section className="support">
        <h2>{t('In case you didn\'t find an answer to your question here, please provide us some details and tell us about the problem you encounter via the support form below.')}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="Operating System">{t('operating system')}</label>
            <select name="Operating System" defaultValue={''} onBlur={changeSystem} ref={register({ required: true })}>
              <option value="" disabled hidden>-- select operating system --</option>
              <option value="Linux">Linux</option>
              <option value="macOS">macOS</option>
              <option value="Windows">Windows</option>
              <option value="iOS">iOS</option>
              <option value="android">Android</option>
              <option value="Other">(Other)</option>
            </select>
          </div>
          {errors.browser && 'Please select an operating system.'}
          <div>
            <label htmlFor="Web Browser">{t('web browser')}</label>
            <select name="browser" defaultValue={''} onBlur={changeBrowser} ref={register({ required: true })}>
              <option value="" disabled hidden >-- select web browser --</option>
              <option value="Firefox">Firefox</option>
              <option value="Chrome">Chrome</option>
              <option value="Safari">Safari</option>
              <option value="Opera">Opera</option>
              <option value="Edge">Edge</option>
              <option value="Internet Explorer">Internet Explorer</option>
              <option value="Other">(Other)</option>
            </select>
          </div>
          {errors.browser && 'Please select a web browser.'}
          <div>
            <label htmlFor="Mail Address">{t('email address')}</label>
            {/* eslint-disable-next-line no-useless-escape */}
            <input type="email" placeholder="u.name@udk-berlin.de" name="email" value={mail} onChange={changeMail} ref={register({ required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
          </div>
          {errors.email && 'Please enter a valid email address.'}
          <textarea name="messageInput" placeholder={t('Please describe the problem you encounter …')} rows="7" spellCheck="true" value={msg} onChange={changeMsg} ref={register({ required: true })} />
          {errors.messageInput && 'This field can’t be empty.'}
          <button type="submit" disabled={sending}>{t('SUBMIT')}</button>
        </form>
      </section>
    </>
  )
}

export default Support
