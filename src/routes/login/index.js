import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from 'react-router-dom'
import * as matrixcs from "matrix-js-sdk";

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId
});

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const auth = localStorage.getItem('cr_auth');

  const onSubmit = async () => {
    const data = { "type": "m.login.password", "user": name, "password": password }
    try {
      const sendMessage = await matrixClient.login("m.login.password", data);
      const res = await sendMessage;
      localStorage.setItem('mx_user_id', res.user_id);
      localStorage.setItem('mx_access_token', res.access_token);
      localStorage.setItem('cr_auth', true)
      history.push('/dashboard')
    }
    catch (e) {
      alert(e.data.error)
      return <Redirect to='/login' />
    }
  }

  const changeName = e => setName(e.target.value);
  const changePassword = e => setPassword(e.target.value);

  return (
    auth === null ? (
      <section id="login">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username">username:</label>
            <input name="username" type="text" placeholder="u.name" value={name} onChange={changeName} ref={register({ required: true })} />
            <label>@udk-berlin.de</label>
          </div>
          <div>
            <label htmlFor="password">password:</label>
            <input name="password" type="password" placeholder="" value={password} onChange={changePassword} ref={register({ required: true })} />
          </div>
          <button name="submit" type="submit">LOGIN</button>
        </form>
        <ul>
          <li><a href="https://www.oase.udk-berlin.de/udk-oase-nutzeraccount/" rel="external noopener noreferrer">Which account do I need?</a></li>
          <li><a href="https://www.oase.udk-berlin.de/passwort" rel="external noopener noreferrer">I forgot my username/password!</a></li>
          <li><a href="mailto:info@medienhaus.udk-berlin.de?subject=medienhaus/help" rel="external noopener noreferrer">I cannot log in!</a></li>
        </ul>
      </section>) : (
        <Redirect to='/' />
      )
  );
}

export default Login;