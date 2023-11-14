import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HttpRequest from '../../../utils/HttpRequest';
import SubmitDetailsForm from './SubmitDetailsForm';

const SubmitDetails = () => {
  const navigate = useNavigate();

  const [userDataInput, setUserDataInput] = useState({
    givenName: '',
    familyName: '',
  });
  const [isError, setIsError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDataChangeHandler = (event) => {
    const { name, value } = event.target;
    setUserDataInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const urlParams = new URLSearchParams(window.location.search);
  const provider = urlParams.get('provider');
  const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    const givenName = userDataInput.givenName;
    const familyName = userDataInput.familyName;
    const email = userDataInput.email;

    const userInputData = { givenName, familyName, email };

    try {
      const response = await HttpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/complete-setup`,
        { userInputData }
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        navigate(`/login-check?isLoggedIn=true&${response.data}`);
      } else {
        navigate('/account-management');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data)
      ) {
        setIsError(error.response.data);
      } else {
        navigate('/');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <SubmitDetailsForm
      userDataInput={userDataInput}
      isError={isError}
      isSubmitting={isSubmitting}
      providerText={providerText}
      userDataChangeHandler={userDataChangeHandler}
      submitFormHandler={submitFormHandler}
    />
  );
};

export default SubmitDetails;
