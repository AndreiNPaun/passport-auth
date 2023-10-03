import React, { Suspense } from 'react';

import { useLoaderData, defer, Await } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';

import AccountManagement from '../components/AccountManagement/AccountManagement';
import httpRequest from '../utils/httpRequest';

const AccountManagementPage = () => {
  const { data } = useLoaderData();

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
      <Await resolve={data}>
        {(loadedData) => <AccountManagement userInfo={loadedData} />}
      </Await>
    </Suspense>
  );
};

export default AccountManagementPage;

const loadedUserData = async () => {
  const response = await httpRequest(
    'get',
    `${process.env.REACT_APP_SERVER_URL}/edit-profile`
  );

  return response.data;
};

export const loader = () => {
  return defer({
    data: loadedUserData(),
  });
};
