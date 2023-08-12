import axios from 'axios';

// Custom hook for axios requests

const httpRequest = async (method, url, values = {}) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };

  if (method !== 'get') {
    options.data = values;
  }

  const response = await axios({ method, url, ...options });
  return response;
};

export default httpRequest;
