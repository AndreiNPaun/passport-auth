import httpRequest from './utils/httpRequest';

export default {
  getList: async (resource, params) => {
    try {
      const url = new URL(`${process.env.REACT_APP_SERVER_URL}/${resource}`);

      // Add query parameters to the URL based on the 'params' argument
      if (params.filter) {
        Object.keys(params.filter).forEach((key) =>
          url.searchParams.append(key, params.filter[key])
        );
      }

      const response = await httpRequest('get', url.toString());

      console.log(response);

      return {
        data: response.data.map((user) => ({
          ...user,
          id: user._id,
        })),
        total: response.data.length,
      };
    } catch (error) {
      console.error('Error:', error);
      throw new Error(error);
    }
  },
  getOne: async (resource, params) => {
    try {
      const response = await httpRequest(
        'get',
        `${process.env.REACT_APP_SERVER_URL}/get-user/${params.id}`
      );

      return {
        data: {
          ...response.data,
          id: response.data._id,
        },
      };
    } catch (error) {
      console.error('Error:', error);
      throw new Error(error);
    }
  },
  update: async (resource, params) => {
    try {
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/update-user/${params.id}`,
        params.data
      );

      return {
        data: {
          ...response.data,
          id: response.data._id,
        },
      };
    } catch (error) {
      console.error('Error:', error);
      throw new Error(error);
    }
  },
  delete: async (resource, params) => {
    try {
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/delete-user/${params.id}`
      );

      if (!response.data) {
        throw new Error('User not found');
      }

      return { data: response.data };
    } catch (error) {
      console.error('Error:', error);
      throw new Error(error);
    }
  },
};
