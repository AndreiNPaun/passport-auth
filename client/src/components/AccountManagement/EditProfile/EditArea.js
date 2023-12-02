import React from 'react';
import {
  Box,
  Text,
  Grid,
  VStack,
  Flex,
  useMediaQuery,
  Center,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { unsetToken } from '../../../store/action/login';
import HttpRequest from '../../../utils/HttpRequest';
import Card from '../../UI/Card';
import CustomButton from '../../UI/CustomButton';

const EditArea = ({ userData, showFormHandler }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [is1130] = useMediaQuery('(min-width: 1130px)');

  const deleteAccountHandler = async () => {
    const proceed = window.confirm(
      'Are you sure you wish to delete your account?'
    );

    if (proceed) {
      await HttpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/account-management/delete-account`
      );

      dispatch(unsetToken());
      navigate('/');
    }
  };

  return (
    <Center>
      <Card m="3rem 1rem 0" w={is1130 ? '60%' : '90%'} overflow="hidden">
        <Grid templateColumns={is1130 ? '30% 70%' : '100%'} gap="1rem">
          {is1130 && (
            <Box p="1rem" borderRight="1px solid" borderColor="gray.300">
              <Text fontSize="2xl" mt="2rem">
                Personal Information
              </Text>
              <Text mt="1rem">
                This section contains private user data. Ensure accuracy and
                confidentiality.
              </Text>
            </Box>
          )}
          <Box p="1rem">
            <Grid templateColumns="repeat(2, 1fr)" gap="2rem" m="1rem 0">
              {[
                { label: 'First Name', value: userData?.givenName },
                { label: 'Last Name', value: userData?.familyName },
                { label: 'Role', value: userData?.role },
              ].map(({ label, value }) => (
                <VStack alignItems="start" ml="1rem" key={label} spacing={2}>
                  <Text fontSize="xl" color="blue.500">
                    {label}
                  </Text>
                  <Text fontSize="xl">{value}</Text>
                </VStack>
              ))}
            </Grid>
            <Flex
              direction={is1130 ? 'row' : 'column'}
              alignItems="center"
              justifyContent="center"
              mt="1rem"
            >
              <CustomButton m="1rem" onClick={showFormHandler}>
                Edit Information
              </CustomButton>
              <CustomButton
                m="1rem"
                bg="#cf0f04"
                _hover={{ bg: '#7c0902' }}
                onClick={deleteAccountHandler}
              >
                Delete Account
              </CustomButton>
            </Flex>
          </Box>
        </Grid>
      </Card>
    </Center>
  );
};

export default EditArea;
