import { List, Datagrid, TextField, TextInput, SelectInput } from 'react-admin';

import { useMediaQuery } from '@chakra-ui/react';

const roles = [
  { id: 'guest', name: 'Guest' },
  { id: 'admin', name: 'Admin' },
];

const postFilters = [
  <SelectInput label="Role" source="role" choices={roles} alwaysOn />,
  <TextInput label="Search by First Name" source="givenName" />,
  <TextInput label="Search by Family Name" source="familyName" />,
];

const UserList = () => {
  const [is1200] = useMediaQuery('(min-width: 1200px)');

  return (
    <List filters={postFilters}>
      <Datagrid rowClick="edit">
        {is1200 && <TextField source="id" />}
        <TextField source="givenName" />
        <TextField source="familyName" />
        <TextField source="role" />
      </Datagrid>
    </List>
  );
};
export default UserList;
