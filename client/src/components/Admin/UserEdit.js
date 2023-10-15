import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';

const UserEdit = (props) => (
  <Edit title="Edit User" {...props}>
    <SimpleForm>
      <TextInput source="givenName" />
      <TextInput source="familyName" />
      <TextInput source="email" />
      <SelectInput
        source="role"
        choices={[
          { id: 'guest', name: 'Guest' },
          { id: 'developer', name: 'Developer' },
          { id: 'moderator', name: 'Moderator' },
          { id: 'admin', name: 'Admin' },
        ]}
      />
    </SimpleForm>
  </Edit>
);

export default UserEdit;
