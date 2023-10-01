import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Container } from '@chakra-ui/react';

import { setFormOpen } from '../../store/action/form';
import EditProfile from './EditProfile';
import EditArea from './EditArea';
import ProviderArea from './ProviderArea';

const AccountManagement = ({ userInfo }) => {
  const [userData, setUserData] = useState(userInfo);

  const dispatch = useDispatch();
  const formCheck = useSelector((state) => state.form.formCheck);

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
