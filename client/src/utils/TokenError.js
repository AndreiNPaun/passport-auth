import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { unsetToken } from '../store/action/login';
import { useNavigate } from 'react-router-dom';

export const TokenErrorComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(unsetToken());
    navigate('/');
  }, [dispatch, navigate]);

  return null;
};

export const TokenErrorFunction = (dispatch, navigate) => {
  dispatch(unsetToken());
  navigate('/');
};
