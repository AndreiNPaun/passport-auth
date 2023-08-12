import React, { useEffect } from 'react';

import httpRequest from '../utils/httpRequest';

const EditProfile = () => {
  useEffect(() => {
    const request = async () => {
      try {
        const response = await httpRequest(
          'get',
          `${process.env.REACT_APP_SERVER_URL}/edit-profile`
        );

        console.log('response', response);
      } catch (error) {
        console.log('error', error);
        if (error.request.status === 401) {
          const token = await httpRequest(
            'post',
            `${process.env.REACT_APP_SERVER_URL}/refresh-token`
          );

          console.log('token', token);

          const newResponse = await httpRequest(
            'get',
            `${process.env.REACT_APP_SERVER_URL}/edit-profile`
          );

          console.log('newResponse', newResponse);
        }
      }
    };

    request();
  }, []);

  return (
    <>
      <p>Hello World!</p>
    </>
  );
};

export default EditProfile;
