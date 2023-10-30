import React from 'react';
import { Admin, Resource, Layout } from 'react-admin';
import UserList from './UserList';
import UserEdit from './UserEdit';

import dataProvider from '../../dataProvider';

const CustomLayout = (props) => {
  return <Layout {...props} appBar={() => null} />;
};

const Dashboard = () => {
  return (
    <Admin dataProvider={dataProvider} layout={CustomLayout}>
      <Resource
        name="list-users"
        list={UserList}
        edit={UserEdit}
        options={{ label: 'Users' }}
      />
    </Admin>
  );
};

export default Dashboard;
