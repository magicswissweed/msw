import React, { useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {firebaseAuth} from '../../firebase/FirebaseConfig';

// @ts-ignore
export const MswLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(true);

  function onSubmit (email: string, password: string) {
    signInWithEmailAndPassword(firebaseAuth, email, password).then((res) => {
      res.user.getIdToken(true).then((token) => {
        navigate("/spots");
      });
    });
  }


  // @ts-ignore
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(email, password);
    setEmail('');
    setPassword('');
    setIsDisabled(true);
  }

  // @ts-ignore
  function handleChangeEmail(event) {
    setEmail(event.target.value.toLowerCase());
  }

  // @ts-ignore
  function handleChangePassword(event) {
    setPassword(event.target.value.toLowerCase());
  }

  useEffect(() => {
    if (password !== '' && email !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [email, password]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email-input">Email:</label>
        <input
          id="email-input"
          type="text"
          onChange={handleChangeEmail}
          value={email}
        />
      </div>
      <div>
        <label htmlFor="password-input">Password:</label>
        <input
          id="password-input"
          type="password"
          onChange={handleChangePassword}
          value={password}
        />
      </div>
      <button id="login-button" type="submit" disabled={isDisabled}>
        Submit
      </button>
    </form>
  );
};
