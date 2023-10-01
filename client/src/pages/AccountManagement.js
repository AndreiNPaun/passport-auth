import React from 'react';

import { useLoaderData } from 'react-router-dom';

import AccountManagement from '../components/AccountManagement/AccountManagement';
import httpRequest from '../utils/httpRequest';

const AccountManagementPage = () => {
  const data = useLoaderData();
  console.log('data', data);
  return <AccountManagement userInfo={data.data} />;
};

export default AccountManagementPage;

export const loader = async () => {
  return await httpRequest(
    'get',
    `${process.env.REACT_APP_SERVER_URL}/edit-profile`
  );
};

export const action = async ({ request, params }) => {
  const data = await request.formData();

  console.log('abc', data.get('givenName'));

  const userInputData = {
    givenName: data.get('givenName'),
    familyName: data.get('familyName'),
    email: data.get('email'),
  };

  return await httpRequest(
    'post',
    `${process.env.REACT_APP_SERVER_URL}/edit-profile`,
    { userInputData }
  );
};
