import React, { useState } from 'react';
import * as matrixcs from "matrix-js-sdk";
import { useForm } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';

const myUserId = "@request-bot:medienhaus.udk-berlin.de";
const myAccessToken = "MDAyNmxvY2F0aW9uIG1lZGllbmhhdXMudWRrLWJlcmxpbi5kZQowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwMzhjaWQgdXNlcl9pZCA9IEByZXF1ZXN0LWJvdDptZWRpZW5oYXVzLnVkay1iZXJsaW4uZGUKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSBLUztZMyoyMHRENDRQeHNlCjAwMmZzaWduYXR1cmUg1o6ZEgjmbQC9FVK0D4nZZshNrUrgaX8DFWd8R-tBOjoK";
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true
});

export default function App() {
  const { register, handleSubmit, errors } = useForm();
  const [sending, setSending] = useState(false);
  const [department, setDepartment] = useState("");
  const [mail, setMail] = useState("");
  const [msg, setMsg] = useState("");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [account, setAccount] = useState(false);

  const changeMsg = e => {
    setMsg(e.target.value);


  }
  const changeMail = e => setMail(e.target.value);
  const changeDepartment = e => setDepartment(e.target.value);
  const changeName = e => setName(e.target.value);
  const changeRoom = e => setRoom(e.target.value);

  const { t } = useTranslation(['translation', 'request']);

  const onSubmit = async () => {
    //Andi feel free to change markup
    setSending(true);
    const regex = /(\w)(\w+(( |-)|\w+)?)+/g;
    const subst = `$1.$2_ext`;
    const formattedNames = msg.toLowerCase().replace(regex, subst);
    const requestRoom = {
      "msgtype": "m.text",
      "format": "org.matrix.custom.html",
      "body": "support message",
      "formatted_body": "From: <b>" + name + "</b>  <br />User ID: <b>" + localStorage.getItem("mx_user_id") + "</b>  <br /> Email: <b>" + mail + "</b> <br /> Department: <b>" + department + "</b> <br /> Room name: <b>" + room + "</b><br />Notes: <b> " + msg + "</b><hr />"
    }

    const requestAcc = {
      "msgtype": "m.text",
      "format": "org.matrix.custom.html",
      "body": "support message",
      "formatted_body": "From: <b>" + name + "</b>  <br />User ID: <b>" + localStorage.getItem("mx_user_id") + "</b>  <br /> Email: <b>" + mail + "</b> <br /> Department: <b>" + department + "</b><br />Account names: <b> " + msg + "</b> <br /> Formatted Names: <b>" + formattedNames + "</b><hr />"
    }
    try {
      account ? await matrixClient.sendMessage("!NcGFsMFcKRAgDJMEsN:medienhaus.udk-berlin.de", requestAcc) : await matrixClient.sendMessage("!NcGFsMFcKRAgDJMEsN:medienhaus.udk-berlin.de", requestRoom)
      alert(t('request:form.alertSuccess'));
      setSending(false);
    }
    catch (e) {
      console.log(e);
      alert(t('request:form.alertFail'));
      alert("Couldn't send your message. Please check your internet connection");
      setSending(false);
    }
  }

  const WhichForm = () => {


  }

  return (
    <section className="request copy">
      <div id="radiobuttons">
        <input type="radio" id="room" name="request" value="room" checked={account === false} onClick={() => setAccount(false)} onChange={WhichForm} />
        <label htmlFor="room">Room</label>
        <input type="radio" id="account" name="request" value="account" checked={account === true} onClick={() => setAccount(true)} onChange={WhichForm} />
        <label htmlFor="account">Account</label>
      </div>
      {account ? (
        <>
          <p>
            <Trans i18nKey="request:instructionAcc">
              Please fill out the form below to request <strong>external</strong> Accounts ... <em>you don’t have to request accounts for students or faculty members with @udk-berlin.de accounts.They can login with their oase acoounts</em>
            </Trans>
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name">{t('request:form.name')}</label>
              <input type="text" placeholder={t('request:form.nameplaceholder')} name="name" value={name} onChange={changeName} ref={register({ required: true })} />
            </div>
            {errors.name && "Please enter your name."}
            <div>
              <label htmlFor="email">{t('request:form.email')}</label>
              <input type="email" placeholder="u.name@udk-berlin.de" name="email" value={mail} onChange={changeMail} ref={register({ required: true })} />
            </div>
            {errors.email && "Please enter a valid email address."}
            <div>
              <label htmlFor="department">{t('request:form.department')}</label>
              <input type="text" placeholder="Visuelle Kommunikation" name="department" value={department} onChange={changeDepartment} ref={register({ required: true })} />
            </div>
            {errors.department && "Please specifiy the department."}
            <textarea name="notes" placeholder={t('request:form.notesPlaceholderAcc')} rows="3" spellCheck="true" value={msg} onChange={changeMsg} ref={register({ required: true })} />
            {errors.name && "Please enter the names of the accounts you would like to request."}
            <button type="submit" disabled={sending}>{t('request:button')}</button>
          </form>
        </>
      ) : (
          <>
            <p>
              <Trans i18nKey="request:instructionRoom">
                Please fill out the form below to request an <strong>openly accessible</strong> and <strong>public</strong> room … <em>you don’t have to request private rooms, you can create them.</em>
              </Trans>
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name">{t('request:form.name')}</label>
                <input type="text" placeholder={t('request:form.nameplaceholder')} name="name" value={name} onChange={changeName} ref={register({ required: true })} />
              </div>
              {errors.name && "Please enter your name."}
              <div>
                <label htmlFor="email">{t('request:form.email')}</label>
                <input type="email" placeholder="u.name@udk-berlin.de" name="email" value={mail} onChange={changeMail} ref={register({ required: true })} />
              </div>
              {errors.email && "Please enter a valid email address."}
              <div>
                <label htmlFor="department">{t('request:form.department')}</label>
                <input type="text" placeholder="Visuelle Kommunikation" name="department" value={department} onChange={changeDepartment} ref={register({ required: true })} />
              </div>
              {errors.department && "Please specifiy the department."}
              <div>
                <label htmlFor="room">{t('request:form.room')}</label>
                <input type="text" placeholder={t('request:form.roomPlaceholder')} name="room" value={room} onChange={changeRoom} ref={register({ required: true })} />
              </div>
              {errors.room && "Please enter a title for your room."}
              <textarea name="notes" placeholder={t('request:form.notesPlaceholderRoom')} rows="3" spellCheck="true" value={msg} onChange={changeMsg} ref={register} />
              <button type="submit" disabled={sending}>{t('request:button')}</button>
            </form>
          </>
        )
      }
    </section>
  );
}