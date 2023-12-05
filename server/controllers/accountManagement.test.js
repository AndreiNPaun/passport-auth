import { describe, it, expect, vi, beforeEach } from 'vitest';

import User from '../models/user';
import {
  convertIDToObjectID,
  getEditProfile,
  postEditProfile,
  listUserProvider,
  providerAccountsNumber,
  deleteProvider,
  deleteAccount,
} from './accountManagement';

let req;
let res;
let userID;

beforeEach(() => {
  userID = '61234bc1234bc123456789ab';
  req = {
    userID,
    body: {},
    query: {},
  };
  res = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
    json: vi.fn(),
  };
});

describe('convertIDToObjectID()', () => {
  it('should convert user ID to object ID', () => {
    const _id = convertIDToObjectID(userID);

    expect(_id).toBeDefined();
    expect(_id.toString()).toBe(userID);
  });

  it('should throw an error for an invalid userID', () => {
    const userID = 'invalid';

    const convertTestError = () => {
      convertIDToObjectID(userID);
    };

    expect(convertTestError).toThrow();
  });
});

describe('getEditProfile()', () => {
  User.findOne = vi.fn().mockResolvedValue({
    givenName: 'John',
    familyName: 'Doe',
    role: 'guest',
    _id: userID,
  });

  it('should return user data when userID is valid', async () => {
    await getEditProfile(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      givenName: 'John',
      familyName: 'Doe',
      role: 'guest',
    });
  });

  it('should throw if user ID is invalid with status code 500 and message "Server Error."', async () => {
    userID = 'invalid';
    req = { userID };

    await getEditProfile(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});

describe('postEditProfile()', () => {
  it('should update user profile if data is valid', async () => {
    const req = {
      body: {
        userInputData: {
          givenName: 'John',
          familyName: 'Doe',
        },
      },
    };

    User.updateOne = vi.fn().mockResolvedValue({});

    await postEditProfile(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith('Account updated.');
  });

  it('should responed with status code 500 and message "Server Error." if it throws', async () => {
    const req = {
      userID: 'invalid',
      body: {
        userInputData: {
          givenName: 'John',
          familyName: 'Doe',
        },
      },
    };

    User.updateOne = vi.fn().mockRejectedValue(new Error());

    await postEditProfile(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});

describe('listUserProvider()', () => {
  it("should list all user's account conected providers", async () => {
    const req = {
      query: {
        provider: 'test',
      },
    };

    User.findById = vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        provider: {
          test: 'providerData',
        },
      }),
    });

    await listUserProvider(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith('providerData');
  });

  it('should responed with status code 500 and message "Server Error." if it throws', async () => {
    const req = {
      userID: 'invalid',
      query: {
        provider: 'test',
      },
    };

    User.findById = vi.fn().mockReturnValue({
      select: vi.fn().mockRejectedValue(new Error()),
    });

    await listUserProvider(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});

describe('providerAccountsNumber()', () => {
  it('should return the total number of linked accounts', async () => {
    User.findOne = vi.fn().mockResolvedValue({
      provider: {
        google: [{}],
        github: [{}],
        microsoft: [],
        linkedin: [{}],
      },
    });

    const total = await providerAccountsNumber('someId');
    expect(total).toBe(3);
  });
});

describe('deleteProvider()', () => {
  it('should delete a provider connection', async () => {
    const req = {
      body: {
        providerType: 'test',
      },
    };

    User.updateOne = vi.fn().mockResolvedValue({});

    await deleteProvider(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      'Provider connection removed successfully.'
    );
  });

  it('should responed with status code 500 and message "Server Error." if it throws', async () => {
    const req = {
      body: {
        userID: 'invalid',
        providerType: 'test',
      },
    };

    User.updateOne = vi.fn().mockRejectedValue(new Error());

    await deleteProvider(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error.');
  });
});

describe('deleteAccount()', () => {
  it('should delete user account', async () => {
    User.findByIdAndDelete = vi.fn().mockReturnValue(true);

    await deleteAccount(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ message: 'User deleted successfully.' });
  });

  it('should responed with status code 500 and message "Server Error." if it throws', async () => {
    const req = {
      userID: 'invalid',
    };

    User.findByIdAndDelete = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error()));

    await deleteAccount(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});
