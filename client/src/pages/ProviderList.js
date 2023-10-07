import React, { Suspense } from 'react';
import { useLoaderData, useParams, defer, Await } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';

import { TokenErrorComponent } from '../utils/TokenError';
import ProviderList from '../components/AccountManagement/Provider/ProviderList';
import httpRequest from '../utils/httpRequest';

function ProviderListPage() {
  const { data } = useLoaderData();
  const params = useParams();

  return (
    <Suspense
      fallback={
        <Center>
          <Spinner
            mt={'20vh'}
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      }
    >
      <Await resolve={data} errorElement={<TokenErrorComponent />}>
        {(loadedData) => (
          <ProviderList list={loadedData} providerName={params.providerName} />
        )}
      </Await>
    </Suspense>
  );
}

export default ProviderListPage;

const loadProviderList = async (providerName) => {
  const response = await httpRequest(
    'get',
    `${process.env.REACT_APP_SERVER_URL}/list-providers`,
    { provider: providerName }
  );

  return response.data;
};

export const loader = ({ request, params }) => {
  return defer({
    data: loadProviderList(params.providerName),
  });
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
