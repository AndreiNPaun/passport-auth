import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import httpRequest from '../../utils/httpRequest';
import CheckTokenValidity from '../../utils/CheckTokenValidity';
import CreateAccountForm from './CreateAccountForm';

const CreateAccount = () => {
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
  const email = urlParams.get('email') || '';

  // Can't be empty
  const provider = urlParams.get('provider');
  const providerID = urlParams.get('providerID');

  // Capitalize first letter for form text
  const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

  // Extra param which will be slit into key value pair
  const extraParam = urlParams.get('extraParam') || '';

  const sync = urlParams.get('sync') || '';

  // Send updated user data to server
  const submitUserData = async (event) => {
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

    let pathAPI = 'user-data';
    let pathRedirect = '/';
    if (sync) {
      pathAPI = 'sync-account';
      pathRedirect = '/account-management';
    }

    const postUserInput = async (pathAPI) => {
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/${pathAPI}`,
        {
          userInputData,
        }
      );
      return response;
    };

    try {
      await postUserInput(pathAPI);
      console.log('Success.');
      navigate(pathRedirect);
    } catch (error) {
      console.log('Error:', error);
      CheckTokenValidity(() => postUserInput(pathAPI), navigate, dispatch);
      navigate(pathRedirect);
    }
  };

  return (
    <CreateAccountForm
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

export default CreateAccount;
