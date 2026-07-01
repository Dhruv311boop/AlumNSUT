import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticateUser';
import { Role } from '@prisma/client';

export const authorizeRole = (role: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ message: 'Access denied: insufficient permissions' });
      return;
    }

    next();
  };
};
