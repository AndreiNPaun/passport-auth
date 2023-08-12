import React from 'react';
import { useSelector } from 'react-redux';

import Login from '../components/Authentication/Login';
import Dashboard from '../components/Dashboard';

const HomePage = () => {
  const login = useSelector((state) => state.login.loginCheck);

  return (
    <>
      {!login && <Login />}
      {login && <Dashboard />}
    </>
  );
};

export default HomePage;
