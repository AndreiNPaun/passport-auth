import HttpRequest from './utils/HttpRequest';

export default {
  getList: async (resource, params) => {
    try {
      const url = new URL(
        `${process.env.REACT_APP_SERVER_URL}/admin/${resource}`
      );

      // Add query parameters to the URL based on the 'params' argument
      if (params.filter) {
        Object.keys(params.filter).forEach((key) =>
          url.searchParams.append(key, params.filter[key])
        );
      }

      const response = await HttpRequest('get', url.toString());

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
      const response = await HttpRequest(
        'get',
        `${process.env.REACT_APP_SERVER_URL}/admin/get-user/${params.id}`
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
      const response = await HttpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/admin/update-user/${params.id}`,
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
      const response = await HttpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/admin/delete-user/${params.id}`
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
