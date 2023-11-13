import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import HttpRequest from '../../../utils/HttpRequest';
import { TokenErrorFunction } from '../../../utils/TokenError';
import EditProfileForm from './EditProfileForm';

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userDataInput, setUserDataInput] = useState({
    givenName: props.userData.givenName,
    familyName: props.userData.familyName,
    role: props.userData.role,
  });
  const [isError, setIsError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDataChangeHandler = (event) => {
    const { name, value } = event.target;
    setUserDataInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    const givenName = userDataInput.givenName;
    const familyName = userDataInput.familyName;

    const userInputData = { givenName, familyName };

    try {
      await HttpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/account-management/edit-profile`,
        { userInputData }
      );

      props.closeFormHandler();
      setIsSubmitting(false);
      props.updateDisplayedUserData(userDataInput);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data)
      ) {
        setIsError(error.response.data);
      } else if (error.response.status === 401) {
        return TokenErrorFunction(dispatch, navigate);
      } else {
        setIsError(['An error occurred while updating the profile.']);
      }
      setIsSubmitting(false);
    }
  };

  const closeFormHandler = () => {
    props.closeFormHandler();
  };

  return (
    <EditProfileForm
      userData={props.userData}
      isError={isError}
      isSubmitting={isSubmitting}
      userDataChangeHandler={userDataChangeHandler}
      submitFormHandler={submitFormHandler}
      closeFormHandler={closeFormHandler}
    />
  );
};

export default EditProfile;
