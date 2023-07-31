import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Login from '../components/Authentication/Login';
import LoggedIn from '../components/LoggedIn';
import Logout from '../components/Authentication/Logout';

const Homepage = () => {
  const login = useSelector((state) => state.login.loginCheck);

  useEffect(() => {
    const refreshExpiredToken = async () => {
      try {
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/refresh-token`,
          {},
          { withCredentials: true }
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
      {login && <LoggedIn />}
      {login && <Logout />}
    </>
  );
};

export default Homepage;
