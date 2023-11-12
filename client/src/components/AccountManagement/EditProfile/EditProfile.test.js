import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import render from '../../../test-utils';
import HttpRequest from '../../../utils/HttpRequest';
import EditProfile from './EditProfile';

jest.mock('../../../utils/HttpRequest');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('EditProfile', () => {
  const userInfo = { givenName: 'John', familyName: 'Doe', role: 'tester' };

  it('should display user data in the form input fields', () => {
    // render(<EditProfile userInfo={userInfo} />);
  });
});
