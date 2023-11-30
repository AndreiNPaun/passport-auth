import HttpRequest from '../../utils/HttpRequest';

import { loginActions } from '../slice/login';

export const setLogin = (isLoggedIn, role) => {
  return async (dispatch) => {
    try {
      localStorage.setItem('isLoggedIn', isLoggedIn);
      localStorage.setItem('role', role);

      dispatch(loginActions.login({ loginCheck: isLoggedIn, role }));
    } catch (error) {
      throw error;
    }
  };
};

export const unsetToken = () => {
  return async (dispatch) => {
    try {
      dispatch(loginActions.logout());

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');

      await HttpRequest('post', `${process.env.REACT_APP_SERVER_URL}/logout`);
    } catch (error) {
      throw error;
    }
  };
};
