import httpRequest from '../../utils/httpRequest';

import { loginActions } from '../slice/login';

export const setLogin = (isLoggedIn) => {
  return async (dispatch) => {
    try {
      localStorage.setItem('isLoggedIn', isLoggedIn);

      // Sets slice loginCheck value to true
      dispatch(loginActions.login({ loginCheck: isLoggedIn }));
    } catch (Error) {
      console.log(Error);
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

      // Send the logout request to the server
      await httpRequest('post', `${process.env.REACT_APP_SERVER_URL}/logout`);
    } catch (error) {
      console.log(error);
    }
  };
};
