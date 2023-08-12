import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import httpRequest from './httpRequest';
import { unsetToken } from '../store/action/login';

const CheckTokenValidity = (callback) => {
  const [navigation, setNavigation] = useState(false); // used to set navigation
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const request = async () => {
      try {
        const response = await callback();

        console.log('response', response);
      } catch (error) {
        console.log('error', error);
        if (error.request.status === 401) {
          // If server sends 401 status, attempt to refresh token
          try {
            const token = await httpRequest(
              'post',
              `${process.env.REACT_APP_SERVER_URL}/refresh-token`
            );
            console.log('token', token);

            // If token has been refreshed, atttempt to send the request again
            const newResponse = await callback();
            console.log('newResponse', newResponse);
          } catch (refreshError) {
            // If token has failed to refresh, send user back to loginpage
            console.log('Token refresh failed:', refreshError);
            // Remove isLoggedIn from local storage and send request to server to unset tokens from cookie
            dispatch(unsetToken());
            setNavigation(true); // Set state to trigger navigation
          }
        } else {
          console.log('An error has occurred.');
          // Remove isLoggedIn from local storage and send request to server to unset tokens from cookie
          dispatch(unsetToken());
          setNavigation(true); // Set state to trigger navigation
        }
      }
    };

    request();
  }, []);

  // Redirect user back to login if token can't be validated
  useEffect(() => {
    if (navigation) {
      navigate('/');
    }
  }, [navigation]);
};

export default CheckTokenValidity;
