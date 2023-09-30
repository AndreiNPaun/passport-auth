import React from 'react';

import { useLoaderData } from 'react-router-dom';

import ProviderList from '../components/AccountManagement/Provider/ProviderList';
import httpRequest from '../utils/httpRequest';

const ProviderListPage = () => {
  const data = useLoaderData();
  const list = data.data;
  return <ProviderList list={list} />;
};

export default ProviderListPage;

export const loader = async () => {
  const response = await httpRequest(
    'get',
    `${process.env.REACT_APP_SERVER_URL}/list-providers`,
    { provider: 'google' }
  );

  return response;
};
