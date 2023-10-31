import { it, expect, describe, beforeAll, afterAll, vi } from 'vitest';
import mongoose from 'mongoose';
import User from '../models/user';

import {
  checkIfProviderExists,
  checkIfRecordExists,
  authErrorRedirect,
  setUserInformation,
} from './authentication';

let givenName = 'John';
let familyName = 'Doe';
let role = 'guest';
let providerType = 'google';
let providerID = 1;
let email = 'johndoe@gmail.com';

let req;
let res;

describe('functions used by both auth controllers', () => {
  it('should set user information into an object', () => {
    const userData = {
      givenName,
      familyName,
      role,
      providerType,
      providerID,
      email,
    };

    const setUserInfo = setUserInformation(userData);

    expect(setUserInfo.givenName).toBe('John');
    expect(setUserInfo.familyName).toBe('Doe');
    expect(setUserInfo.role).toBe('guest');
    expect(setUserInfo.provider[providerType][0].email).toBe(
      'johndoe@gmail.com'
    );
  });
});

describe('authenticateOrCreateAccount()', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');

    const user = new User({
      givenName,
      familyName,
      role,
      provider: {
        [providerType]: [
          {
            id: providerID,
            email,
          },
        ],
      },
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should return a user's provider record if it exists", async () => {
    const checkProviderExists = await checkIfProviderExists(
      providerType,
      providerID,
      email
    );

    expect(checkProviderExists).not.toBeNull();
    expect(checkProviderExists.role).toBe('guest');
  });

  it("should return a user's record if it exists", async () => {
    const checkRecordExists = await checkIfRecordExists(providerID, email);

    expect(checkRecordExists.provider[providerType][0].email).toBe(
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
});
