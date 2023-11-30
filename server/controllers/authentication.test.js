import { it, expect, describe, beforeAll, afterAll, vi } from 'vitest';
import User from '../models/user';

import {
  checkIfProviderExists,
  checkIfRecordExists,
  authErrorRedirect,
  setUserInformation,
  setRoleForEmailDomain,
} from './authentication';

let givenName = 'John';
let familyName = 'Doe';
let providerType = 'google';
let providerID = 1;
let email = 'johndoe@gmail.com';

let req;
let res;

vi.stubEnv('EMAIL_DOMAIN', '@gmail.com');

describe('functions used by both auth controllers', () => {
  it('should set user information into an object', () => {
    const userData = {
      givenName,
      familyName,
      providerType,
      providerID,
      email,
    };

    const setUserInfo = setUserInformation(userData);

    expect(setUserInfo.givenName).toBe('John');
    expect(setUserInfo.familyName).toBe('Doe');
    expect(setUserInfo.role).toBe('admin');
    expect(setUserInfo.provider[providerType][0].email).toBe(
      'johndoe@gmail.com'
    );
  });
});

describe('authenticateOrCreateAccount()', () => {
  beforeAll(async () => {
    User.findOne = vi.fn().mockReturnValueOnce({
      givenName,
      familyName,
      role: 'guest',
      provider: {
        [providerType]: {
          providerID,
          email,
        },
      },
    });
  });

  afterAll(async () => {
    vi.restoreAllMocks();
  });

  it("should return a user's provider record if it exists", async () => {
    const checkProviderExists = await checkIfProviderExists(
      providerType,
      providerID,
      email
    );

    console.log('checkProviderExists', checkProviderExists);

    expect(checkProviderExists).not.toBeNull();
    expect(checkProviderExists.role).toBe('guest');
  });

  it("should return a user's record if it exists", async () => {
    const mockUser = {
      givenName: 'John',
      familyName: 'Doe',
      role: 'guest',
      provider: {
        google: [{ id: providerID, email }],
        github: [],
        microsoft: [],
        linkedin: [],
      },
    };

    User.findOne = vi.fn((query) => {
      // Check if the query matches any of the $or conditions
      if (
        query.$or.some(
          (cond) =>
            Object.values(cond)[0].$elemMatch.id === providerID &&
            Object.values(cond)[0].$elemMatch.email === email
        )
      ) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    });

    const checkRecordExists = await checkIfRecordExists(providerID, email);

    expect(checkRecordExists.provider.google[0].email).toBe(
      'johndoe@gmail.com'
    );
  });

  it('should set req.user.error to {error: errorMessage}', () => {
    req = { user: {} };
    res = {
      redirect: vi.fn(() => {}),
    };
    const errorValues = {
      error: 'Provider account is already linked to another account.',
    };

    authErrorRedirect(req, res, errorValues);

    expect(req.user.error.error).toBe(
      'Provider account is already linked to another account.'
    );
  });

  it('should set role to admin if email domain is @gmail.com', () => {
    const role = setRoleForEmailDomain(email);

    expect(role).toBe('admin');
  });

  it('should set role to guest if email domain is not @gmail.com', () => {
    email = 'johndoe@test.com';

    const role = setRoleForEmailDomain(email);

    expect(role).toBe('guest');
  });
});
