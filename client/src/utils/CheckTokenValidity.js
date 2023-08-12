import httpRequest from './httpRequest';
import { unsetToken } from '../store/action/login';

const CheckTokenValidity = async (callback, navigate, dispatch) => {
  try {
    const response = await callback();
    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log('error', error);
    if (error.request.status === 401) {
      // If server sends 401 status, attempt to refresh token
      try {
        const accessToken = await httpRequest(
          'post',
          `${process.env.REACT_APP_SERVER_URL}/refresh-token`
        );
        console.log('token', accessToken);

        // If token has been refreshed, atttempt to send the request again
        const newResponse = await callback();
        console.log('newResponse', newResponse);

        // setData(newResponse.data);
        return newResponse.data;
      } catch (refreshError) {
        // If token has failed to refresh, send user back to loginpage
        console.log('Token refresh failed:', refreshError);
        // Remove isLoggedIn from local storage and send request to server to unset tokens from cookie
        dispatch(unsetToken());
        navigate('/');
      }
    } else {
      console.log('An error has occurred.');
      // Remove isLoggedIn from local storage and send request to server to unset tokens from cookie
      dispatch(unsetToken());
      navigate('/');
    }
  }
};

export default CheckTokenValidity;
