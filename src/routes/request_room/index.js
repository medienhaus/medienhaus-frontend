import React, { useState } from 'react';
import * as matrixcs from "matrix-js-sdk";
import { useForm } from 'react-hook-form';
const myUserId = "@request-bot:medienhaus.udk-berlin.de";
const myAccessToken = "MDAyNmxvY2F0aW9uIG1lZGllbmhhdXMudWRrLWJlcmxpbi5kZQowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwMzhjaWQgdXNlcl9pZCA9IEByZXF1ZXN0LWJvdDptZWRpZW5oYXVzLnVkay1iZXJsaW4uZGUKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSA9bTUrMGZfUDI3R1BFOixBCjAwMmZzaWduYXR1cmUgH_cAwuJ9AkfvKauHG_ObX2TDMBXEizvpNJfDJvlBr6EK";
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

  const changeMsg = e => setMsg(e.target.value);
  const changeMail = e => setMail(e.target.value);
  const changeDepartment = e => setDepartment(e.target.value);
  const changeName = e => setName(e.target.value);
  const changeRoom = e => setRoom(e.target.value);

  const onSubmit = async () => {
    //Andi feel free to change markup
    setSending(true);
    const requestRoom = {
      "msgtype": "m.text",
      "format": "org.matrix.custom.html",
      "body": "support message",
      "formatted_body": "From: <b>" + name + "</b>  <br />User ID: <b>" + localStorage.getItem("mx_user_id") + "</b>  <br /> Email: <b>" + mail + "</b> <br /> Department: <b>" + department + "</b> <br /> Room name: <b>" + room + "</b><br />Notes: <b> " + msg + "</b><hr />"
    }
    try {
      await matrixClient.sendMessage("!JkKkqvovaudipgxBSq:medienhaus.udk-berlin.de", requestRoom)
      alert("Your request has ben sent! We will get back to you asap!");
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
      <section className="request">
        <p>Please fill out the form below to request an <strong>openly accessible</strong> and <strong>public</strong> room … <em>you don’t have to request private rooms, you can create them.</em></p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name">your name</label>
            <input type="text" placeholder="Name Yourname" name="name" value={name} onChange={changeName} ref={register({ required: true })} />
          </div>
          {errors.name && "Please enter your name"}
          <div>
            <label htmlFor="email">mail address</label>
            <input type="email" placeholder="u.name@udk-berlin.de" name="email" value={mail} onChange={changeMail} ref={register({ required: true })} />
          </div>
          {errors.email && "Please enter a valid email address"}
          <div>
            <label htmlFor="department">department</label>
            <input type="text" placeholder="Visuelle Kommunikation" name="department" value={department} onChange={changeDepartment} ref={register({ required: true })} />
          </div>
          {errors.department && "Please specifiy the department"}
          <div>
            <label htmlFor="room">room name</label>
            <input type="text" placeholder="i.e. the name of your class or course" name="room" value={room} onChange={changeRoom} ref={register({ required: true })} />
          </div>
          {errors.room && "Please enter a title for your room"}
          <textarea name="notes" placeholder="Any additional notes?" rows="3" spellCheck="true" value={msg} onChange={changeMsg} ref={register} />
          <button type="submit" disabled={sending}>SUBMIT</button>
        </form>
      </section>
    ) : (
        <p>please <a activeclassname="active" href="/login">login</a> first</p>
      )
  );
}