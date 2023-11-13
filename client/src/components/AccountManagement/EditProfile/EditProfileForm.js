import React from 'react';
import {
  Center,
  Box,
  Text,
  List,
  ListItem,
  ListIcon,
  useMediaQuery,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

import Modal from '../../UI/Modal';
import CustomButton from '../../UI/CustomButton';
import Card from '../../UI/Card';
import InputFields from '../../UI/InputFields';

const EditProfileForm = ({
  userData,
  isError,
  isSubmitting,
  userDataChangeHandler,
  submitFormHandler,
  closeFormHandler,
}) => {
  const [is500] = useMediaQuery('(max-width: 500px)');

  const fields = [
    {
      htmlFor: 'givenName',
      labelText: 'First Name',
      id: 'givenName',
      name: 'givenName',
      value: 'givenName',
    },
    {
      htmlFor: 'familyName',
      labelText: 'Family Name',
      id: 'familyName',
      name: 'familyName',
      value: 'familyName',
    },
  ];

  return (
    <Modal onClickCancel={closeFormHandler}>
      <Card mt="20vh" w={is500 ? '80vw' : null} ml={is500 ? '-4.5rem' : null}>
        <Text
          p="1rem"
          m="0 auto"
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          color="blue.600"
        >
          Edit Account
        </Text>
        <Center>
          <Text mb=".5rem" color="#181717">
            Edit your account
          </Text>
        </Center>
        {isError && (
          <List spacing=".5rem" m="1rem 0 1rem 2.5rem">
            {isError.map((err, index) => (
              <ListItem key={index}>
                <ListIcon as={WarningIcon} color="red.500" />
                {err}
              </ListItem>
            ))}
          </List>
        )}

        {fields.map((field) => (
          <Box key={field.id} ml="2.5rem">
            <InputFields
              htmlFor={field.htmlFor}
              labelText={field.labelText}
              id={field.id}
              name={field.name}
              defaultValue={userData[field.value] || ''}
              onChange={userDataChangeHandler}
              inputStyle={{ w: '90%' }}
              required
            />
          </Box>
        ))}
        <Center mt="1rem">
          <CustomButton
            m="1rem"
            type="submit"
            onClick={submitFormHandler}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </CustomButton>
          <CustomButton
            m="1rem"
            onClick={closeFormHandler}
            disabled={isSubmitting}
          >
            Close
          </CustomButton>
        </Center>
      </Card>
    </Modal>
  );
};

export default EditProfileForm;
