import React from 'react';
import { Navigate } from 'react-router-dom';

import AuthCheck from '../components/Authentication/AuthCheck';

const LoginCheck = () => {
  return (
    <>
      <p>test</p>
      <AuthCheck />
      <Navigate to="/" />
    </>
  );
};

export default LoginCheck;
