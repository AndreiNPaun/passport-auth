import React, { Suspense, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { unsetToken } from '../store/action/login';

import { useLoaderData, useNavigate, defer, Await } from 'react-router-dom';
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
      <Await resolve={data} errorElement={<ErrorRedirector />}>
        {(loadedData) => <AccountManagement userInfo={loadedData} />}
      </Await>
    </Suspense>
  );
};

export default AccountManagementPage;

const loadedUserData = async () => {
  try {
    const response = await httpRequest(
      'get',
      `${process.env.REACT_APP_SERVER_URL}/edit-profile`
    );
    console.log('res', response);
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
    const response = await httpRequest(
      'post',
      `${process.env.REACT_APP_SERVER_URL}/edit-profile`,
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

const ErrorRedirector = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(unsetToken());
    navigate('/');
  }, [dispatch, navigate]);

  return null;
};
