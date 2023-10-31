import { it, expect, describe, vi, beforeEach } from 'vitest';
import User from '../models/user';

import {
  buildUserQuery,
  filterUsersByRole,
  listUsers,
  getOneUser,
  updateUser,
  deleteUserAdmin,
} from './admin';

let req;
let res;
beforeEach(() => {
  req = {
    query: {},
  };
  res = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
    json: vi.fn(),
  };
});

describe('buildUserQuery()', () => {
  it('should return an empty query when no parameters are provided', () => {
    const query = buildUserQuery(req);

    expect(query).toEqual({});
  });

  it('should build a query with a givenName', () => {
    const req = { query: { givenName: 'John' } };

    const query = buildUserQuery(req);

    expect(query).toEqual({ givenName: /John/i });
  });

  it('should build a query with multiple parameters', () => {
    req = { query: { givenName: 'John', email: 'test@example.com' } };

    const query = buildUserQuery(req);

    expect(query).toEqual({ givenName: /John/i, email: /test@example\.com/i });
  });

  it('should handle special characters correctly', () => {
    req = { query: { email: 'test+test@example.com' } };

    const query = buildUserQuery(req);

    expect(query.email).toEqual(/test\+test@example\.com/i);
  });
});

describe('filterUsersByRole()', () => {
  const users = [
    { id: 1, role: 'admin' },
    { id: 2, role: 'moderator' },
    { id: 3, role: 'user' },
    { id: 4, role: 'admin' },
    { id: 5, role: 'user' },
  ];

  it('should filter out admin users, regardless of requesterRole', () => {
    const requesterRole = 'user';

    const filteredUsers = filterUsersByRole(users, requesterRole);

    expect(filteredUsers).toEqual([
      { id: 2, role: 'moderator' },
      { id: 3, role: 'user' },
      { id: 5, role: 'user' },
    ]);
  });

  it('should filter out admin and moderator users when requesterRole is moderator', () => {
    const requesterRole = 'moderator';

    const filteredUsers = filterUsersByRole(users, requesterRole);

    expect(filteredUsers).toEqual([
      { id: 3, role: 'user' },
      { id: 5, role: 'user' },
    ]);
  });

  it('should only filter out admin users when requesterRole is not moderator', () => {
    const requesterRole = 'user';

    const filteredUsers = filterUsersByRole(users, requesterRole);

    expect(filteredUsers).toEqual([
      { id: 2, role: 'moderator' },
      { id: 3, role: 'user' },
      { id: 5, role: 'user' },
    ]);
  });
});

describe('listUsers()', () => {
  it('listUsers responds with 200 and returns filtered users', async () => {
    req.query = [
      {
        id: 1,
        role: 'test',
        givenName: 'Jon',
        familyName: 'Doe',
        email: 'johndoe@test.com',
      },
      {
        id: 2,
        role: 'admin',
        givenName: 'Andy',
        familyName: 'Anderson',
        email: 'andyanderson@test.com',
      },
    ];
    req.role = 'test';

    User.find = vi.fn().mockResolvedValue(req.query);
    const filterUsersByRoleMock = vi.fn().mockReturnValue(req.query);

    vi.mock('filterUsersByRole', () => ({
      filterUsersByRole: filterUsersByRoleMock,
    }));

    await listUsers(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith([req.query[0]]);
  });

  it('should throw with status code 500 and error message "Server Error."', async () => {
    User.find = vi.fn().mockRejectedValue(new Error());

    await listUsers(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});

describe('getOneUser()', async () => {
  it('should return a user by id', async () => {
    const req = {
      params: { id: 1 },
    };
    const user = { id: 1, name: 'John Doe', email: 'johndoe@example.com' };

    User.findById = vi.fn().mockResolvedValue(user);

    await getOneUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('should throw with status code 500 and error message "Server Error."', async () => {
    User.findById = vi.fn().mockRejectedValue(new Error());

    await getOneUser(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});

describe('updateUser', () => {
  it('should update user record', async () => {
    const req = {
      params: { id: 1 },
    };
    const user = { id: 1, name: 'Doe Joe' };

    User.findByIdAndUpdate = vi.fn().mockResolvedValue(user);

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('should throw with status code 500 and error message "Server Error."', async () => {
    User.findByIdAndUpdate = vi.fn().mockRejectedValue(new Error());

    await updateUser(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});

describe('deleteUserAdmin()', () => {
  it('should delete a user and return success message', async () => {
    const req = {
      params: { id: 1 },
    };

    User.findByIdAndDelete = vi.fn().mockResolvedValue(true);

    await deleteUserAdmin(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      message: 'User deleted successfully.',
    });
  });

  it('should throw with status code 500 and error message "Server Error."', async () => {
    User.findByIdAndDelete = vi.fn().mockRejectedValue(new Error());

    await deleteUserAdmin(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith('Server Error.');
  });
});
