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

  // If URL values are null set them to empty string
  const givenName = urlParams.get('givenName') || '';
  const familyName = urlParams.get('familyName') || '';

  // Can't be empty
  const email = urlParams.get('email');
  const provider = urlParams.get('provider');
  const providerID = urlParams.get('providerID');

  // Capitalize first letter for form text
  const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

  // Extra param which will be slit into key value pair
  const extraParam = urlParams.get('extraParam') || '';

  const sync = urlParams.get('sync') || '';

  // Send updated user data to server
  const submitUserData = async (event) => {
    console.log('start');
    event.preventDefault();

    // Data which is already set in the URL will replace the one which is supposed to be from the user input
    // Input fields will be hidden if the user data can be retrieved from the URL
    const userInputData = {
      givenName: givenNameInputRef.current?.value || givenName,
      familyName: familyNameInputRef.current?.value || familyName,
      email: emailInputRef.current?.value || email,
      provider: provider,
      providerID: providerID,
      extraParam: extraParam,
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
    }
  };

  return (
    <SubmitDetailsForm
      providerText={providerText}
      givenName={givenName}
      familyName={familyName}
      email={email}
      submitUserData={submitUserData}
      givenNameInputRef={givenNameInputRef}
      familyNameInputRef={familyNameInputRef}
      emailInputRef={emailInputRef}
    />
  );
};

export default SubmitDetails;
