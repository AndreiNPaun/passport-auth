import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import AuthCheck from './AuthCheck';
import { setLogin } from '../../store/action/login';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('../../store/action/login', () => ({
  setLogin: jest.fn(),
}));

describe('AuthCheck', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
    useDispatch.mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches setLogin and navigates to home on successful login', () => {
    delete window.location;
    window.location = { search: '?isLoggedIn=true&role=user' };
    render(<AuthCheck />);

    expect(mockDispatch).toBeCalledWith(setLogin('true', 'user'));
    expect(mockNavigate).toBeCalledWith('/');
  });

  it('should navigate to homepage if not logged in', () => {
    render(<AuthCheck />);

    expect(mockDispatch).not.toBeCalledWith();
    expect(mockNavigate).toBeCalledWith('/');
  });
});
