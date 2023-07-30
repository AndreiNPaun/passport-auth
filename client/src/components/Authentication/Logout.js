import React from 'react';

import { useDispatch } from 'react-redux';
import { unsetToken } from '../../store/action/login';

const Logout = () => {
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(unsetToken());
  };

  return (
    <>
      <button onClick={logoutUser}>Logout</button>
    </>
  );
};

export default Logout;
