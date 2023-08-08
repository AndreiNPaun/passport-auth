import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Login from '../components/Authentication/Login';
import Dashboard from '../components/Dashboard';
import httpRequest from '../utils/httpRequest';

const HomePage = () => {
  const login = useSelector((state) => state.login.loginCheck);

  useEffect(() => {
    const refreshExpiredToken = async () => {
      try {
        await httpRequest(
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
      {!login && <Login />}
      {login && <Dashboard />}
    </>
  );
};

export default HomePage;
