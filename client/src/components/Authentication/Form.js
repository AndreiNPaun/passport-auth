import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import styles from './Form.module.css';

const Form = () => {
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
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user-data`,
        {
          userData,
        }
      );

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className={styles['form-container']}>
      <p>
        Enter your details associated with your <b>{provider}</b> account:
      </p>
      <form>
        <div className={styles['form-group']}>
          {!givenName && (
            <>
              <label>First Name</label>
              <input
                type="text"
                name="givenName"
                ref={givenNameInputRef}
                required
              />
            </>
          )}
        </div>
        <div className={styles['form-group']}>
          {!familyName && (
            <>
              <label>Last Name</label>
              <input
                type="text"
                name="familyName"
                ref={familyNameInputRef}
                required
              />
            </>
          )}
        </div>
        <div className={styles['form-group']}>
          {!email && (
            <>
              <label>Email</label>
              <input type="email" name="email" ref={emailInputRef} required />
            </>
          )}
        </div>
        <button onClick={submitUserData}>Submit</button>
      </form>
    </div>
  );
};

export default Form;
