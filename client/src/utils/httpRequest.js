import axios from 'axios';

// Custom hook for axios requests
const HttpRequest = async (method, url, values = {}) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };

  if (['post', 'put', 'patch'].includes(method)) {
    options.data = values;
  } else if (method === 'get') {
    options.params = values;
  }

  const response = await axios({ method, url, ...options });
  return response;
};

export default HttpRequest;
