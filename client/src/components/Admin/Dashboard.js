import React, { useEffect, useState } from 'react';

import httpRequest from '../../utils/httpRequest';

const Dashboard = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await httpRequest(
        'get',
        `${process.env.REACT_APP_SERVER_URL}/list-users`
      );
      console.log('response', response);

      setUserList(response);
    })();
  }, []);

  return <>Yo</>;
};

export default Dashboard;
