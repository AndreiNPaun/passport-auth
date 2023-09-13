import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setFormClose } from '../../store/action/form';
import CheckTokenValidity from '../../utils/CheckTokenValidity';
import httpRequest from '../../utils/httpRequest';

import Modal from '../UI/ModalForm';

const EditProfile = (props) => {
  // Passed down as arguments for CheckTokenValidity
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const givenNameInputRef = useRef();
  const familyNameInputRef = useRef();
  const emailInputRef = useRef();

  // Change state to false which closes the form
  const closeFormHandler = () => {
    dispatch(setFormClose());
  };

  const submitHandler = async (event) => {
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
    const response = await CheckTokenValidity(submitData, navigate, dispatch);

    if (response.status === 200) {
      props.updateDisplayedUserData(userInputData);
    }

    // Change form state to false
    dispatch(setFormClose());
  };

  const fields = [
    {
      htmlFor: 'givenName',
      labelText: 'First Name',
      id: 'givenName',
      ref: givenNameInputRef,
      value: 'givenName',
    },
    {
      htmlFor: 'familyName',
      labelText: 'Family Name',
      id: 'familyName',
      ref: familyNameInputRef,
      value: 'familyName',
    },
    {
      htmlFor: 'email',
      labelText: 'Email',
      id: 'email',
      ref: emailInputRef,
      value: 'email',
    },
  ];

  return (
    <Modal
      modalTitle="Edit Account"
      modalText="Edit your account"
      onClickCancel={closeFormHandler}
      onClickSubmit={submitHandler}
      value={props.userData}
      fields={fields}
      // errorText={errorMessage}
    />
  );
};

export default EditProfile;
