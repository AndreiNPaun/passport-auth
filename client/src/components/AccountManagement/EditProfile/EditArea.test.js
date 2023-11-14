import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { unsetToken } from '../../../store/action/login';

import { render } from '../../../test-utils';
import EditArea from './EditArea';
import HttpRequest from '../../../utils/HttpRequest';

jest.mock('../../../utils/HttpRequest');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../../../store/action/login', () => ({
  unsetToken: jest.fn(),
}));

describe('EditArea', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    window.confirm = jest.fn().mockImplementation(() => true);
    HttpRequest.mockResolvedValueOnce();

    useDispatch.mockImplementation(() => mockDispatch);
    useNavigate.mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const userData = { givenName: 'John', familyName: 'Doe', role: 'tester' };

  it('should check if delete account has been called', async () => {
    render(<EditArea userData={userData} showFormHandler={() => {}} />);

    const deleteButtonElement = screen.getByRole('button', {
      name: 'Delete Account',
    });
    await userEvent.click(deleteButtonElement);

    expect(window.confirm).toBeCalledWith(
      'Are you sure you wish to delete your account?'
    );
  });

  it('should call HttpRequest to delete user account', async () => {
    render(<EditArea userData={userData} showFormHandler={() => {}} />);

    const deleteButtonElement = screen.getByRole('button', {
      name: 'Delete Account',
    });
    await userEvent.click(deleteButtonElement);

    expect(HttpRequest).toBeCalledWith(
      'post',
      `${process.env.REACT_APP_SERVER_URL}/account-management/delete-account`
    );
  });

  it('should check if dispatch has been called with redux action unsetToken', async () => {
    render(<EditArea userData={userData} showFormHandler={() => {}} />);
    const deleteButtonElement = screen.getByRole('button', {
      name: 'Delete Account',
    });
    await userEvent.click(deleteButtonElement);

    expect(mockDispatch).toBeCalledWith(unsetToken());
  });

  it('should check if navigate has been called with path "/"', async () => {
    render(<EditArea userData={userData} showFormHandler={() => {}} />);
    const deleteButtonElement = screen.getByRole('button', {
      name: 'Delete Account',
    });
    await userEvent.click(deleteButtonElement);

    expect(mockNavigate).toBeCalledWith('/');
  });
});
