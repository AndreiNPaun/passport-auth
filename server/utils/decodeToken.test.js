import { it, expect, vi } from 'vitest';
import { sign } from 'jsonwebtoken';

import decodeToken from './decodeToken';

let tokenType = 'ACCESS';

vi.stubEnv('ACCESS_TOKEN_SECRET', 'test');
vi.stubEnv('REFRESH_TOKEN_SECRET', 'test');
vi.stubEnv('SETUP_TOKEN_SECRET', 'test');

const testToken = sign({ id: 1, role: 'user' }, 'test', {
  expiresIn: '1m',
});

it('should return an object containin', () => {
  const decoded = decodeToken(testToken, tokenType);

  expect(decoded).toContain({ id: 1, role: 'user' });
});

it('should throw if token type is unsupported', () => {
  tokenType = 'invalid';

  const decodeFn = () => {
    decodeToken(testToken, tokenType);
  };

  expect(decodeFn).toThrow();
});

it('should log "Token expired." if error name is JsonWebTokenError', () => {
  const consoleOutputs = [];
  console.log = (message) => {
    consoleOutputs.push(message);
  };

  decodeToken('testToken', 'ACCESS');

  expect(consoleOutputs).toContain('Token expired.');
});

it('should throw if token verification has failed', () => {
  const decodeFn = () => {
    decodeToken();
  };

  expect(decodeFn).toThrow();
});
