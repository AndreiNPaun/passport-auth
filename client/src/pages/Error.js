import React from 'react';

import { useRouteError } from 'react-router-dom';

import MainNavigation from '../components/MainNavigation';
import BasicPageContent from '../components/BasicPageContet';

const ErrorPage = () => {
  const error = useRouteError();

  console.log('err page', error.response);

  let title = 'An error occurred!';
  let message = 'Something went wrong.';

  if (error.response) {
    title = error.response.status;
    message = error.response.data;
  }

  return (
    <>
      <MainNavigation />
      <BasicPageContent title={title} message={message} />
    </>
  );
};

export default ErrorPage;
