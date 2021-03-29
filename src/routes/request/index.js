import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation, Trans } from 'react-i18next'
import { makeRequest } from '../../Backend'

export default function App () {
  const { register, handleSubmit, errors } = useForm()
  const [sending, setSending] = useState(false)
  const [radio, setRadio] = useState(false)
  const [department, setDepartment] = useState('')
  const [mail, setMail] = useState('')
  const [msg, setMsg] = useState('')
  const [room, setRoom] = useState('')
  const [name, setName] = useState('')
  const [account, setAccount] = useState('')

  const changeMsg = e => {
    setMsg(e.target.value)
  }

  const changeMail = e => setMail(e.target.value)
  const changeDepartment = e => setDepartment(e.target.value)
  const changeName = e => setName(e.target.value)
  const changeRoom = e => setRoom(e.target.value)
  const changeAccount = e => setAccount(e.target.value)

  const { t } = useTranslation('request')

  const onSubmit = async () => {
    // Andi feel free to change markup
    setSending(true)
    const regex = /(\w)(\w+(( |-)|\w+)?)+/g
    const subst = '$1.$2_ext'
    const formattedNames = account.toLowerCase().replace(regex, subst)
    const requestRoom = {
      name: name,
      displayname: localStorage.getItem('medienhaus_user_id'),
      mail: mail,
      department: department,
      room: room,
      notes: msg
    }

    const requestAcc = {
      name: name,
      displayname: localStorage.getItem('medienhaus_user_id'),
      mail: mail,
      department: department,
      account: account,
      formattedNames: formattedNames,
      notes: msg
    }

    try {
      if (!radio) {
        makeRequest('messenger/requestRoom', requestRoom).then(msg => {
          console.log(msg)
        })
      } else {
        makeRequest('messenger/requestAcc', requestAcc).then(msg => {
          console.log(msg)
        })
      }
      alert(t('Your request has ben sent! We will get back to you asap!'))
      setSending(false)
    } catch (e) {
      console.log(e)
      alert(t('Couldn\'t send your message. Please check your internet connection'))
      setSending(false)
    }
  }

  const nameEmailAndDepartmentInputs = (
    <>
      <div>
        <label htmlFor="name">{t('your name')}</label>
        <input type="text" placeholder={t('Name Yourname')} name="name" value={name} onChange={changeName} ref={register({ required: true })} />
      </div>
      {errors.name && 'Please enter your name.'}
      <div>
        <label htmlFor="email">{t('email address')}</label>
        <input type="email" placeholder="u.name@udk-berlin.de" name="email" value={mail} onChange={changeMail} ref={register({ required: true })} />
      </div>
      {errors.email && 'Please enter a valid email address.'}
      <div>
        <label htmlFor="department">{t('department')}</label>
        <input type="text" placeholder={t('arts and media')} name="department" value={department} onChange={changeDepartment} ref={register({ required: true })} />
      </div>
      {errors.department && 'Please specify the department.'}
    </>
  )

  return (
    <section className="request copy">
      <div id="formchooser">
        <input type="radio" id="room" name="room" value="room" checked={radio === false} onClick={() => setRadio(false)} />
        <label htmlFor="room">Room</label>
        <input type="radio" id="account" name="account" value="account" checked={radio === true} onClick={() => setRadio(true)} />
        <label htmlFor="account">Account</label>
      </div>
      {radio
        ? (
        <>
          <p>
            <Trans t={t} i18nKey="instructionAcc">
              Please fill out the form below to request a temporary <strong>external</strong> account … <em>this is only necessary for people without an @udk-berlin.de account.</em>
            </Trans>
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {nameEmailAndDepartmentInputs}
            <div>
              <label htmlFor="account">{t('invitees')}</label>
              <input type="text" placeholder={t('first and last names, seperated by commas')} name="account" value={account} onChange={changeAccount} ref={register({ required: true })} />
            </div>
            {errors.account && 'Please enter the names of the accounts you would like to request.'}
            <textarea name="notes" placeholder={t('Any additional notes?')} rows="3" spellCheck="true" value={msg} onChange={changeMsg} ref={register} />
            <button type="submit" disabled={sending}>{t('SUBMIT')}</button>
          </form>
        </>
          )
        : (
          <>
            <p>
              <Trans t={t} i18nKey="instructionRoom">
                Please fill out the form below to request an <strong>openly accessible</strong> and <strong>public</strong> room … <em>you don’t have to request private rooms, you can create them.</em>
              </Trans>
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              {nameEmailAndDepartmentInputs}
              <div>
                <label htmlFor="room">{t('room name')}</label>
                <input type="text" placeholder={t('i.e. the name of your class or course')} name="room" value={room} onChange={changeRoom} ref={register({ required: true })} />
              </div>
              {errors.room && 'Please enter a title for your room.'}
              <textarea name="notes" placeholder={t('Any additional notes?')} rows="3" spellCheck="true" value={msg} onChange={changeMsg} ref={register} />
              <button type="submit" disabled={sending}>{t('SUBMIT')}</button>
            </form>
          </>
          )
      }
    </section>
  )
}
