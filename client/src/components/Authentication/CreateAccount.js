import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import httpRequest from '../../utils/httpRequest';

import CreateAccountForm from './CreateAccountForm';

const CreateAccount = () => {
  const givenNameInputRef = useRef();
  const familyNameInputRef = useRef();
  const emailInputRef = useRef();

  const navigate = useNavigate();

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

  // Send updated user data to server
  const submitUserData = async (event) => {
    event.preventDefault();

    // Data which is already set in the URL will replace the one which is supposed to be from the user input
    // Input fields will be hidden if the user data can be retrieved from the URL
    const userData = {
      givenName: givenNameInputRef.current?.value || givenName,
      familyName: familyNameInputRef.current?.value || familyName,
      email: emailInputRef.current?.value || email,
      provider: provider,
      providerID: providerID,
      extraParam: extraParam,
    };

    try {
      console.log(userData);
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/user-data`,
        { userData }
      );

      if (response.status === 200) {
        console.log('Success.');
        navigate('/');
      } else {
        console.log('Error');
      }
    } catch (error) {
      console.log('Error:', error);
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
