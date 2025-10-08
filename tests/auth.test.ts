import { Request, Response, NextFunction } from 'express';
import { authController } from '../src/controllers/authController';
import { StatusCodes } from '../src/utils';

jest.mock('../src/services/authService');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer test-token',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('logout', () => {
    it('should return a success message on logout', async () => {
      await (authController.logout as any)(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: undefined,
        message: 'Logged out successfully',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});