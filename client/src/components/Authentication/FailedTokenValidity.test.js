import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import FailedTokenValidity from './FailedTokenValidity';
import { unsetToken } from '../../store/action/login';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('../../store/action/login', () => ({
  unsetToken: jest.fn(),
}));

describe('FailedTokenValidity', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    delete window.location;
    useNavigate.mockImplementation(() => mockNavigate);
    useDispatch.mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch unsetToken and navigates to home when token is expired', () => {
    window.location = { search: '?tokenExpired=true' };
    render(<FailedTokenValidity />);

    expect(mockDispatch).toBeCalledWith(unsetToken());
    expect(mockNavigate).toBeCalledWith('/');
  });

  it('should do nothing when token is not expired', () => {
    window.location = {};
    render(<FailedTokenValidity />);

    expect(mockDispatch).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });
});
