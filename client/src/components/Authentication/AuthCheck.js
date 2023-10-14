import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setLogin } from '../../store/action/login';

const AuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Login check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isLoggedIn = urlParams.get('isLoggedIn');
    const role = urlParams.get('role');

    try {
      if (isLoggedIn && role) {
        dispatch(setLogin(isLoggedIn, role));
        navigate('/');
      }
    } catch (Error) {
      console.log(Error);
    }
  }, []);
};

export default AuthCheck;
