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

    // Change form state to false
    dispatch(setFormClose());
  };

  return (
    <Modal
      modalTitle="Edit Account"
      modalText="Edit your account"
      onClickCancel={closeFormHandler}
      onClickSubmit={submitHandler}
      value={props.userData}
      inputRef={{ givenNameInputRef, familyNameInputRef, emailInputRef }}
      // errorText={errorMessage}
    />
  );
};

export default EditProfile;
