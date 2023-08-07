import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Login from '../components/Authentication/Login';
import Dashboard from '../components/Dashboard';
import Logout from '../components/Authentication/Logout';
import HttpRequest from '../utils/HttpRequest';

const HomePage = () => {
  const login = useSelector((state) => state.login.loginCheck);

  useEffect(() => {
    const refreshExpiredToken = async () => {
      try {
        await HttpRequest(
          'post',
          `${process.env.REACT_APP_SERVER_URL}/refresh-token`
        );
        console.log('Token refresh successfully.');
      } catch (error) {
        console.log('Error:', error);
      }
    };

    if (login) {
      refreshExpiredToken();
    }
  }, []);

  return (
    <>
      <h1>Authentication</h1>
      {!login && <Login />}
      {login && <Dashboard />}
      {login && <Logout />}
    </>
  );
};

export default HomePage;
