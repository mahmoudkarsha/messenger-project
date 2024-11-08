import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LoginWrapper,
  FormWrapper,
  FormGroup,
  TextInput,
  Submit,
} from '../../Assets/styled/authentication';

import logoLoading from '../../Assets/imgs/loading1.png';
import bgLogin from '../../Assets/svgs/loginsvgbg.svg';
import loginsvg from '../../Assets/svgs/loginsvg.svg';

import server from '../../Functions/methods/Server/server';
import errorHandler from '../../Functions/methods/Server/axiosErrorHandler';
import {
  insertOne,
  $Users,
  updateAll,
  findOneById,
} from '../../Functions/methods/LocalDB/db';
import { toast } from '../Toast';

let intervalId = 0;

export default function Login({ userState }) {
  const [user, setUser] = userState;

  const [formValues, setFormValues] = useState({
    number: '',
    password: '',
  });

  const [progressValue, setProgressValue] = useState(10);

  useEffect(() => {
    intervalId = setInterval(() => {
      setProgressValue((value) => value + 1);
    }, 20);
  }, []);

  const onInputChange = function (inputName) {
    return function (e) {
      setFormValues({ ...formValues, [inputName]: e.target.value });
    };
  };

  if (progressValue < 100)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
        }}
      >
        <img alt="loh" src={logoLoading} width="600" />

        <progress id="file" value={progressValue} max="100"></progress>

        <h1
          style={{
            fontFamily: 'Panda',
          }}
        >
          Bernameya Ragihandina Hêzên Ewlekariya Navxweyî
        </h1>
        <h1
          style={{
            fontFamily: 'Panda',
          }}
        >
          برنامج التواصل لقوى الأمن الداخلي
        </h1>
      </div>
    );

  clearInterval(intervalId);
  if (user) return <Navigate to="/" />;

  const onFormSubmit = function () {
    let sessionId = (Math.random() * 10000000000000).toFixed(0);
    if (window?.localStorage) {
      const storedSessionId = window.localStorage.getItem('sessionId');
      if (!storedSessionId) {
        window.localStorage.setItem('sessionId', sessionId);
      } else {
        sessionId = storedSessionId;
      }
    }
    server
      .post('/login', { ...formValues, sessionId })
      .then(async (data) => {
        //set all users active to no
        await updateAll($Users, { active: 'no' });
        return insertOne($Users, {
          active: 'yes',
          role: data.data.result.role,
          token: data.data.result.token,
          number: data.data.result.user_number,
        });
      })
      .then((id) => {
        return findOneById($Users, id);
      })
      .then((user) => setUser(user))
      .catch((err) => {
        const errorMessage = errorHandler(err);
        toast(errorMessage);
        console.log(errorMessage);
      });
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', width: '100%' }}>
        <h1
          style={{
            textAlign: 'center',
            marginTop: '1em',
            fontSize: '4vw',
            color: '#777',
          }}
        >
          Messenger
        </h1>
      </div>
      <div>
        <LoginWrapper>
          <FormWrapper>
            <h1
              style={{
                color: '#fff',

                fontFamily: 'Vazi',
                padding: 10,
              }}
            >
              تسجيل الدخول ....
            </h1>
            <FormGroup>
              <TextInput
                onChange={onInputChange('number')}
                value={formValues.number}
              />
            </FormGroup>
            <FormGroup>
              <TextInput
                type="password"
                onChange={onInputChange('password')}
                value={formValues.password}
                password
              />
            </FormGroup>
            <FormGroup>
              <Submit onClick={onFormSubmit}>تسجيل الدخول</Submit>
            </FormGroup>
          </FormWrapper>
        </LoginWrapper>
      </div>

      <div
        style={{ position: 'absolute', bottom: '0px', right: 0, zIndex: 10 }}
      >
        <img alt="log" src={bgLogin} width="100%" />
      </div>
      <div style={{ position: 'absolute', bottom: '0px', width: '100%' }}>
        <img src={loginsvg} width="100%" />
      </div>
    </div>
  );
}
