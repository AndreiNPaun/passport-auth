const GetAPIResponse = async (callback, navigate, dispatch) => {
  try {
    const response = await callback();
    console.log('response', response);

    return response;
  } catch (error) {
    console.log('error', error);
    if (error.request.status === 401) {
      console.log('Unauthorized access.');
      // dispatch(unsetToken());
      // navigate('/');
    } else {
      console.log('An error has occurred.');
      // Remove isLoggedIn from local storage and send request to server to unset tokens from cookie
      // dispatch(unsetToken());
      // navigate('/');
    }
  }
};

export default GetAPIResponse;
