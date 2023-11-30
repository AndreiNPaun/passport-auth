import React, { Suspense } from 'react';

import { useLoaderData, defer, Await } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';

import AccountManagement from '../components/AccountManagement/AccountManagement';
import HttpRequest from '../utils/HttpRequest';
import { TokenErrorComponent } from '../utils/TokenError';

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
      <Await resolve={data} errorElement={<TokenErrorComponent />}>
        {(loadedData) => <AccountManagement userInfo={loadedData} />}
      </Await>
    </Suspense>
  );
};

export default AccountManagementPage;

const loadedUserData = async () => {
  try {
    const response = await HttpRequest(
      'get',
      `${process.env.REACT_APP_SERVER_URL}/account-management/edit-profile`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const loader = () => {
  return defer({
    data: loadedUserData(),
  });
};

export const action = async ({ request, params }) => {
  const data = await request.formData();

  const userInputData = {
    givenName: data.get('givenName'),
    familyName: data.get('familyName'),
    email: data.get('email'),
  };

  try {
    const response = await HttpRequest(
      'post',
      `${process.env.REACT_APP_SERVER_URL}/account-management/edit-profile`,
      { userInputData }
    );

    return response;
  } catch (error) {
    if (error.response.status === 422) {
      return { errors: error.response.data };
    }

    throw error;
  }
};
