import { it, expect, vi, beforeEach } from 'vitest';

import authorize from './authorize';

let req;
let res;
let next;

beforeEach(() => {
  req = {};
  res = {
    status: vi.fn(() => res),
    send: vi.fn(),
  };
  next = vi.fn();
});

it('should only call next if role is admin', () => {
  req.role = 'admin';

  authorize(req, res, next);

  expect(res.status).not.toBeCalled();
  expect(res.send).not.toBeCalled();
  expect(next).toBeCalled();
});

it('should only call next if role is moderator', () => {
  req.role = 'admin';

  authorize(req, res, next);

  expect(res.status).not.toBeCalled();
  expect(res.send).not.toBeCalled();
  expect(next).toBeCalled();
});

it('should send status code 401 if role is not admin or moderator', () => {
  req.role = 'guest';

  authorize(req, res, next);

  expect(res.status).toBeCalledWith(401);
  expect(res.send).toBeCalled();
  expect(next).not.toBeCalled();
});
