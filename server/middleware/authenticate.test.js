import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sign } from 'jsonwebtoken';

import {
  checkRefreshToken,
  generateNewAccessToken,
  authenticate,
  passportStateOrTokenCheck,
} from './authenticate';

let req;
let res;
let next;

vi.stubEnv('ACCESS_TOKEN_SECRET', 'test');
vi.stubEnv('ACCESS_TOKEN_EXPIRY', '1m');
vi.stubEnv('REFRESH_TOKEN_SECRET', 'test');
vi.stubEnv('REFRESH_TOKEN_EXPIRY', '1m');

const testToken = sign({ id: 1, role: 'user' }, 'test', {
  expiresIn: '1m',
});

beforeEach(() => {
  req = {
    cookies: {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    },
    user: {
      state: 'state',
    },
  };

  res = {
    cookie: vi.fn(() => res),
    status: vi.fn(() => res),
    send: vi.fn(),
    redirect: vi.fn(),
  };

  next = vi.fn();
});

describe('Authenticate Middleware', () => {
  it('should respond with status code 401 and call send if the refresh token is invalid', () => {
    req.cookies.refreshToken = 'invalid';

    checkRefreshToken(req, res);

    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalled();
  });

  it('should generate a new access token and set it as a cookie', () => {
    const userData = { id: 1, role: 'user' };

    generateNewAccessToken(userData, res);

    expect(res.cookie).toBeCalled();
  });

  it('should redirect user to homepage if error is thrown', () => {
    req.cookies.accessToken = 'invalid';

    authenticate(req, res, next);

    expect(res.redirect).toBeCalledWith(`${process.env.CLIENT_URL}`);
  });

  it('should set req.userID and req.role, and then call next', () => {
    req.cookies.accessToken = testToken;

    authenticate(req, res, next);

    expect(req.userID).toBe(1);
    expect(req.role).toBe('user');
    expect(next).toBeCalled();
  });
});

describe('PassportStateOrTokenCheck Middleware', () => {
  it('should call next if req.user.state is falsy', () => {
    req.user.state = null;

    passportStateOrTokenCheck(req, res, next);

    expect(next).toBeCalled();
  });
});
