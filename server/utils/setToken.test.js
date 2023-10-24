import { it, expect, vi } from 'vitest';

import setToken from './setToken';

vi.stubEnv('ACCESS_TOKEN_SECRET', 'test');
vi.stubEnv('ACCESS_TOKEN_EXPIRY', '1m');
vi.stubEnv('REFRESH_TOKEN_SECRET', 'test');
vi.stubEnv('REFRESH_TOKEN_EXPIRY', '1m');

let _id = 1;
let role = 'user';

it('should create access and refresh token', () => {
  const tokens = setToken({ _id, role });

  expect(tokens).toHaveProperty('accessToken');
  expect(tokens).toHaveProperty('refreshToken');
});

it('should throw an error if _id is null', () => {
  _id = null;

  const setTokenFn = () => {
    setToken({ _id, role });
  };

  expect(setTokenFn).toThrowError('ID and Role cannot be null.');
});

it('should throw an error if role is null', () => {
  role = null;

  const setTokenFn = () => {
    setToken({ _id, role });
  };

  expect(setTokenFn).toThrowError('ID and Role cannot be null.');
});

it('should throw an error if the signing process fails', () => {
  const setTokenFn = () => {
    setToken({ _id, role });
  };

  expect(setTokenFn).toThrowError('An error occurred while creating tokens');
});
