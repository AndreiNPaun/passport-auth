import {
  List,
  Datagrid,
  TextField,
  EmailField,
  TextInput,
  SelectInput,
} from 'react-admin';

const roles = [
  { id: 'guest', name: 'Guest' },
  { id: 'developer', name: 'Developer' },
  { id: 'moderator', name: 'Moderator' },
  { id: 'admin', name: 'Admin' },
];

const postFilters = [
  <SelectInput label="Role" source="role" choices={roles} alwaysOn />,
  <TextInput label="Search by First Name" source="givenName" />,
  <TextInput label="Search by Family Name" source="familyName" />,
];

const UserList = () => (
  <List filters={postFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="givenName" />
      <TextField source="familyName" />
      <TextField source="role" />
    </Datagrid>
  </List>
);

export default UserList;
