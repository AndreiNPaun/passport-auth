import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setLogin } from '../../store/action/login';

const AuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('authcheck launched');

  // Login check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isLoggedIn = urlParams.get('isLoggedIn');

    try {
      if (isLoggedIn) {
        dispatch(setLogin(isLoggedIn));
        navigate('/');
      }
    } catch (Error) {
      console.log(Error);
    }
  }, []);
};

export default AuthCheck;
