import { describe, it, expect, vi, beforeEach } from 'vitest';

import authorize from './authorize';

describe('Authorize Middleware', () => {
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

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should only call next if role is moderator', () => {
    req.role = 'admin';

    authorize(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should send status code 401 if role is not admin or moderator', () => {
    req.role = 'guest';

    authorize(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
