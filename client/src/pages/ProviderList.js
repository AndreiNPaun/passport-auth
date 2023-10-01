import React from 'react';

import { useLoaderData, useParams } from 'react-router-dom';

import ProviderList from '../components/AccountManagement/Provider/ProviderList';
import httpRequest from '../utils/httpRequest';

const ProviderListPage = () => {
  const data = useLoaderData();
  const params = useParams();

  return <ProviderList list={data.data} providerName={params.providerName} />;
};

export default ProviderListPage;

export const loader = async ({ request, params }) => {
  return await httpRequest(
    'get',
    `${process.env.REACT_APP_SERVER_URL}/list-providers`,
    { provider: params.providerName }
  );
};

export const action = async ({ request, params }) => {
  const data = await request.formData();

  const providerID = data.get('providerID');
  const providerType = data.get('providerType');

  return await httpRequest(
    'post',
    `${process.env.REACT_APP_SERVER_URL}/delete-provider`,
    { providerID, providerType }
  );
};
