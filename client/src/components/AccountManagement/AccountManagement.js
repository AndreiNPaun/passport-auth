import React, { useState } from 'react';
import { Container } from '@chakra-ui/react';

import EditProfile from './EditProfile';
import EditArea from './EditArea';
import ProviderArea from './ProviderArea';

const AccountManagement = ({ userInfo }) => {
  const [userData, setUserData] = useState(userInfo);
  const [formStatus, setFormStatus] = useState(false);

  const showFormHandler = () => {
    setFormStatus(true);
  };

  const updateDisplayedUserData = (newUserData) => {
    setUserData(newUserData);
  };

  const closeFormHandler = () => {
    setFormStatus(false);
  };

  return (
    <>
      {formStatus && (
        <EditProfile
          userData={userData}
          updateDisplayedUserData={updateDisplayedUserData}
          closeFormHandler={closeFormHandler}
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
