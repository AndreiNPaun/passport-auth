import React, { useState } from 'react';

import EditProfile from './EditProfile/EditProfile';
import EditArea from './EditProfile/EditArea';
import ProviderArea from './Provider/ProviderArea';

const AccountManagement = ({ userInfo }) => {
  const [userData, setUserData] = useState(userInfo);
  console.log(userData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const showFormHandler = () => {
    setIsFormOpen(true);
  };

  const updateDisplayedUserData = (newUserData) => {
    setUserData(newUserData);
  };

  const closeFormHandler = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      {isFormOpen && (
        <EditProfile
          userData={userData}
          updateDisplayedUserData={updateDisplayedUserData}
          closeFormHandler={closeFormHandler}
        />
      )}
      <EditArea userData={userData} showFormHandler={showFormHandler} />
      <ProviderArea />
    </>
  );
};

export default AccountManagement;
