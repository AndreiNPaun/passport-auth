import React, { Suspense } from 'react';

import { useLoaderData, defer, Await } from 'react-router-dom';

import AccountManagement from '../components/AccountManagement/AccountManagement';
import httpRequest from '../utils/httpRequest';

const AccountManagementPage = () => {
  const data = useLoaderData();
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
