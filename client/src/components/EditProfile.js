import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import CheckTokenValidity from '../utils/CheckTokenValidity';
import httpRequest from '../utils/httpRequest';
import EditProfileForm from './EditProfileForm';

const EditProfile = () => {
  // Passed down as arguments for CheckTokenValidity
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const givenNameInputRef = useRef();
  const familyNameInputRef = useRef();
  const emailInputRef = useRef();

  const [userData, setUserData] = useState(); // Used to get data out of useEffect hook

  // Once page renders populate fields with user data
  useEffect(() => {
    (async () => {
      const getData = async () => {
        const response = await httpRequest(
          'get',
          `${process.env.REACT_APP_SERVER_URL}/edit-profile`
        );
        return response;
      };

      const userData = await CheckTokenValidity(getData, navigate, dispatch);
      console.log('userData', userData);
      setUserData(userData);
    })();
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    const userInputData = {
      givenName: givenNameInputRef.current.value,
      familyName: familyNameInputRef.current.value,
      email: emailInputRef.current.value,
    };

    const submitData = async () => {
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/edit-profile`,
        { userInputData }
      );
      return response;
    };

    // Call function which checks for token and if ok sends data
    CheckTokenValidity(submitData, navigate, dispatch);

    navigate('/');
  };

  return (
    <EditProfileForm
      userData={userData}
      givenNameInputRef={givenNameInputRef}
      familyNameInputRef={familyNameInputRef}
      emailInputRef={emailInputRef}
      submitHandler={submitHandler}
    />
  );
};

export default EditProfile;
