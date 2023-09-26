import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container } from '@chakra-ui/react';

import { setFormOpen } from '../../store/action/form';
import GetAPIResponse from '../../utils/GetAPIResponse';
import httpRequest from '../../utils/httpRequest';
import EditProfile from './EditProfile';
import EditArea from './EditArea';
import ProviderArea from './ProviderArea';

const AccountManagement = () => {
  const [userData, setUserData] = useState(); // Used to get data out of useEffect hook

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formCheck = useSelector((state) => state.form.formCheck);

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

      const response = await GetAPIResponse(getData, navigate, dispatch);
      const userData = response.data;
      console.log('userData', userData);

      setUserData(userData);
    })();
  }, []);

  const showFormHandler = () => {
    dispatch(setFormOpen());
  };

  const updateDisplayedUserData = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <>
      {formCheck && (
        <EditProfile
          userData={userData}
          updateDisplayedUserData={updateDisplayedUserData}
        />
      )}
      <Container mt="4rem" maxW="60%">
        <EditArea userData={userData} showFormHandler={showFormHandler} />
        <ProviderArea />
      </Container>
    </>
  );
};

export default AccountManagement;
