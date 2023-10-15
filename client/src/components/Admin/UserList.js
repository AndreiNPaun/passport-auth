import { List, Datagrid, TextField, EmailField } from 'react-admin';

const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="givenName" />
      <TextField source="familyName" />
      <TextField source="role" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export default UserList;
