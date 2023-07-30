import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { setLogin } from '../../store/action/login';

const AuthCheck = () => {
  const dispatch = useDispatch();

  // Login check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isLoggedIn = urlParams.get('isLoggedIn');

    try {
      if (isLoggedIn) {
        dispatch(setLogin(isLoggedIn));
      }
    } catch (Error) {
      console.log(Error);
    }
  }, []);

  return <></>;
};

export default AuthCheck;
