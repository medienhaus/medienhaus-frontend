import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as matrixcs from "matrix-js-sdk";
import Profile from "../../components/matrix_profile";
/*
import style from './style.css';
*/
const myUserId = "@support-bot:medienhaus.udk-berlin.de";
const myAccessToken = "MDAyNmxvY2F0aW9uIG1lZGllbmhhdXMudWRrLWJlcmxpbi5kZQowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwMzhjaWQgdXNlcl9pZCA9IEBzdXBwb3J0LWJvdDptZWRpZW5oYXVzLnVkay1iZXJsaW4uZGUKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSBwQVZqWU9XflI0NFRYUkEtCjAwMmZzaWduYXR1cmUgdZm-5kS1tijZ3TQkBeiwsO261iOCBA-lhbLcTb4bTccK";
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true
});

const Support = () => {
  const { register, handleSubmit, errors } = useForm();
  const [msg, setMsg] = useState("");
  const [mail, setMail] = useState("");
  const [system, setSystem] = useState();
  const [browser, setBrowser] = useState();
  const [sending, setSending] = useState(false);
  const profile = Profile();

  const changeMsg = e => setMsg(e.target.value);
  const changeMail = e => setMail(e.target.value);
  const changeBrowser = e => setBrowser(e.target.value);
  const changeSystem = e => setSystem(e.target.value);

  const onSubmit = async () => {
    //Andi feel free to change markup
    setSending(true);
    const support = {
      "msgtype": "m.text",
      "format": "org.matrix.custom.html",
      "body": "support message",
      "formatted_body": "From: <b>" + profile.displayname + "</b>  <br /> Email: <b>" + mail + "</b> <br /> Browser: <b>" + browser + "</b> <br /> Operating system: <b>" + system + "</b><hr /> <b> " + msg + "</b><br />"
    }
    try {
      await matrixClient.sendMessage("!PHQMOmXiiNqFUJNDie:medienhaus.udk-berlin.de", support)
      alert("Your message has ben sent! We will get back to you asap!");
      setSending(false);
    }
    catch (e) {
      console.log(e);
      alert("Couldn't send your message. Please check your internet connection");
      setSending(false);
    }
  }
  return (
    localStorage.getItem('mx_access_token') !== null ? (
      <section className="support">
        <ul>
          <li><Link to="/help">Maybe your question is answered in the FAQs?</Link></li>
          <li><Link to="/docs">Maybe your problem is described in the docs?</Link></li>
          <li><Link to="/request">Request an openly accessible public room?</Link></li>
        </ul>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="Operating System">operating system</label>
            <select name="Operating System" defaultValue={''} onChange={changeSystem} ref={register({ required: true })}>
              <option value="" disabled hidden>-- select operating system --</option>
              <option value="Linux">Linux</option>
              <option value="macOS">macOS</option>
              <option value="Windows">Windows</option>
              <option value="iOs">iOs</option>
              <option value="android">Android</option>
              <option value="Other">(Other)</option>
            </select>
          </div>
          {errors.browser && "Please select an operating system"}
          <div>
            <label htmlFor="Web Browser">web browser</label>
            <select name="browser" defaultValue={''} onChange={changeBrowser} ref={register({ required: true })}>
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
          {errors.browser && "Please select a Browser"}
          <div>
            <label htmlFor="Mail Address">mail address</label>
            {/* eslint-disable-next-line*/}
            <input type="email" placeholder="u.name@udk-berlin.de" name="email" value={mail} onChange={changeMail} ref={register({ required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
          </div>
          {errors.email && "Please enter a valid email address"}
          <textarea name="messageInput" placeholder="Please describe the problem you encounter …" rows="7" spellCheck="true" value={msg} onChange={changeMsg} ref={register({ required: true })} />
          {errors.messageInput && "This field can't be empty"}
          <button type="submit" disabled={sending}>SUBMIT</button>
        </form>
      </section>
    ) : (
        <p>Please <a activeclassname="active" href="/login">login</a> first</p>
      )

  );
}

export default Support;
