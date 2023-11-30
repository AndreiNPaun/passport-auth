import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { useSelector } from 'react-redux';

const UserEdit = () => {
  const role = useSelector((state) => state.login.role);

  const choices = [
    { id: 'guest', name: 'Guest' },
    { id: 'admin', name: 'Admin' },
  ];

  return (
    <Edit title="Edit User">
      <SimpleForm>
        <TextInput source="givenName" />
        <TextInput source="familyName" />
        {role && role === 'owner' && (
          <SelectInput source="role" choices={choices} />
        )}
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
