import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { useSelector } from 'react-redux';

const UserEdit = () => {
  const role = useSelector((state) => state.login.role);

  const choices = [
    { id: 'guest', name: 'Guest' },
    { id: 'developer', name: 'Developer' },
    { id: 'moderator', name: 'Moderator' },
  ];

  if (role && role === 'admin') {
    choices.push({ id: 'admin', name: 'Admin' });
  }

  return (
    <Edit title="Edit User">
      <SimpleForm>
        <TextInput source="givenName" />
        <TextInput source="familyName" />
        <SelectInput source="role" choices={choices} />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
