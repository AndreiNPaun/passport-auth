import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { unsetToken } from '../../store/action/login';

const FailedTokenValidity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenExpired = urlParams.get('tokenExpired');

    try {
      if (tokenExpired) {
        dispatch(unsetToken());
        navigate('/');
      }
    } catch (error) {
      navigate('/');
    }
  }, [dispatch, navigate]);
};

export default FailedTokenValidity;
