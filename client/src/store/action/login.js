import HttpRequest from '../../utils/HttpRequest';

import { loginActions } from '../slice/login';

export const setLogin = (isLoggedIn, role) => {
  return async (dispatch) => {
    try {
      localStorage.setItem('isLoggedIn', isLoggedIn);
      localStorage.setItem('role', role);

      // Sets slice loginCheck value to true
      dispatch(loginActions.login({ loginCheck: isLoggedIn, role }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const unsetToken = () => {
  return async (dispatch) => {
    try {
      // Dispatch the logout action to update the Redux store
      dispatch(loginActions.logout());

      // Clear the token in local storage after the action is dispatched
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');

      // Send the logout request to the server
      await HttpRequest('post', `${process.env.REACT_APP_SERVER_URL}/logout`);
    } catch (error) {
      console.log(error);
    }
  };
};
