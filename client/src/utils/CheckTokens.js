import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

import { useDispatch } from 'react-redux';
import { unsetToken } from '../store/action/login';

const CheckTokens = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const isRefreshTokenExpired = Cookies.get('isRefreshTokenExpired');
    if (isRefreshTokenExpired) {
      Cookies.remove('isRefreshTokenExpired');
      dispatch(unsetToken());
      console.log('kek removed');
      navigate('/');
    }
  }, []);
};

export default CheckTokens;
