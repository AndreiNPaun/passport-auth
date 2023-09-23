import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import httpRequest from '../../../utils/httpRequest';
import GetAPIResponse from '../../../utils/GetAPIResponse';
import SubmitDetailsForm from './SubmitDetailsForm';

const SubmitDetails = () => {
  const givenNameInputRef = useRef();
  const familyNameInputRef = useRef();
  const emailInputRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // URL data
  const urlParams = new URLSearchParams(window.location.search);

  const provider = urlParams.get('provider');

  const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

  // Send updated user data to server
  const submitUserData = async (event) => {
    event.preventDefault();

    // Data which is already set in the URL will replace the one which is supposed to be from the user input
    // Input fields will be hidden if the user data can be retrieved from the URL
    const userInputData = {
      givenName: givenNameInputRef.current?.value,
      familyName: familyNameInputRef.current?.value,
    };

    console.log(userInputData);

    const pathAPI = 'user-data';

    const postUserInput = async (pathAPI) => {
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/${pathAPI}`,
        {
          userInputData,
        }
      );
      console.log(response);
      return response;
    };

    try {
      const response = await GetAPIResponse(
        () => postUserInput(pathAPI),
        navigate,
        dispatch
      );

      console.log('resp', response);

      if (response.status === 200) {
        navigate(`/login-check?isLoggedIn=${response}`);
      } else {
        navigate('/account-management');
      }
    } catch (error) {
      console.log('Error:', error);
      navigate('/');
    }
  };

  return (
    <SubmitDetailsForm
      providerText={providerText}
      submitUserData={submitUserData}
      givenNameInputRef={givenNameInputRef}
      familyNameInputRef={familyNameInputRef}
      emailInputRef={emailInputRef}
    />
  );
};

export default SubmitDetails;
