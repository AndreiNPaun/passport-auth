import React from 'react';

import { useSelector } from 'react-redux';

import Logout from '../components/Authentication/Logout';

const MainNavigation = () => {
  const login = useSelector((state) => state.login.loginCheck);

  let navbar = undefined;

  if (login) {
    navbar = (
      <>
        <h1>Auth</h1>
        <Logout />
      </>
    );
  }

  return navbar;
};

export default MainNavigation;
