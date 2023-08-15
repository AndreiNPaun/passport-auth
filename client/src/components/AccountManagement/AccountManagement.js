import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setFormOpen } from '../../store/action/form';
import CheckTokenValidity from '../../utils/CheckTokenValidity';
import httpRequest from '../../utils/httpRequest';
import EditProfile from './EditProfile';
import AccountManagementForm from './AccountManagementForm';

const MyProfile = () => {
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

      const userData = await CheckTokenValidity(getData, navigate, dispatch);
      console.log('userData', userData);

      setUserData(userData);
    })();
  }, []);

  const showFormHandler = () => {
    dispatch(setFormOpen());
  };

  return (
    <>
      {formCheck && <EditProfile userData={userData} />}
      <AccountManagementForm
        userData={userData}
        showFormHandler={showFormHandler}
      />
    </>
  );
};

export default MyProfile;