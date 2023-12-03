import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CustomButton from '../UI/CustomButton';

const UserEdit = () => {
  const role = useSelector((state) => state.login.role);
  const navigate = useNavigate();

  const choices = [
    { id: 'guest', name: 'Guest' },
    { id: 'admin', name: 'Admin' },
  ];

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <CustomButton
        w="6rem"
        p=".4rem"
        colorScheme="blue"
        onClick={goBackHandler}
        mb={1}
        borderRadius="md"
      >
        Go Back
      </CustomButton>
      <Edit title="Edit User">
        <SimpleForm>
          <TextInput source="givenName" />
          <TextInput source="familyName" />
          {role && role === 'owner' && (
            <SelectInput source="role" choices={choices} />
          )}
        </SimpleForm>
      </Edit>
    </>
  );
};

export default UserEdit;
