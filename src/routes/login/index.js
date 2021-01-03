import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from 'react-router-dom'
import { UserContext } from '../../components/context/UserContext'
import * as matrixcs from "matrix-js-sdk";
import { useTranslation } from 'react-i18next';

const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true
});

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation(['translation', 'login']);

  const onSubmit = async () => {
    const data = { "type": "m.login.password", "user": name, "password": password }

    try {
      const sendMessage = await matrixClient.login("m.login.password", data);
      const res = await sendMessage;
      localStorage.setItem('mx_access_token', res.access_token);
      localStorage.setItem('mx_home_server', res.home_server);
      localStorage.setItem('mx_hs_url', res['well_known']['m.homeserver']['base_url']);
      localStorage.setItem('mx_user_id', res.user_id);
      localStorage.setItem('mx_device_id', res.device_id);
      setUser(res.user_id);
      history.push('/dashboard')
      return (window.location.reload(false))
    }
    catch (e) {
      alert(e.data.error)
      return <Redirect to='/login' />
    }
  }

  const changeName = e => setName(e.target.value);
  const changePassword = e => setPassword(e.target.value);

  return (
    < section id="login" >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">{t('login:username')}:</label>
          <input name="username" type="text" placeholder={t('login:usernamePlaceholder')} value={name} onChange={changeName} ref={register({ required: true })} />

        </div>
        {errors.username && t('login:usernameError')}
        <div>
          <label htmlFor="password">{t('login:password')}:</label>
          <input name="password" type="password" placeholder="" value={password} onChange={changePassword} ref={register({ required: true })} />
        </div>
        {errors.password && t('login:passwordError')}
        <button name="submit" type="submit">LOGIN</button>
      </form>
      <ul>
        <li><a href="https://www.oase.udk-berlin.de/udk-oase-nutzeraccount/" rel="external noopener noreferrer">{t('login:account')}</a></li>
        <li><a href="https://www.oase.udk-berlin.de/passwort" rel="external noopener noreferrer">{t('login:oasepw')}</a></li>
        <li><a href="mailto:info@medienhaus.udk-berlin.de?subject=medienhaus/help" rel="external noopener noreferrer">{t('login:help')}</a></li>
      </ul>
    </section >
  );
}

export default Login;