import { Request, Response } from 'express';
import prisma from '../utils/db';
import { verifyAccessToken } from '../utils/jwt';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.userId || !decoded.role) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    let user;
    if (decoded.role === 'STUDENT') {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId, role: 'STUDENT' },
        select: { id: true, email: true, role: true, name: true }
      });
    } else if (decoded.role === 'MENTOR') {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId, role: 'MENTOR' },
        select: { id: true, email: true, role: true, name: true }
      });
    } else if (decoded.role === 'ADMIN') {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId, role: 'ADMIN' },
        select: { id: true, email: true, role: true, name: true }
      });
    }

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
};

export const refresh = (req: Request, res: Response): void => {
  // Mock refresh token logic since frontend doesn't send it correctly right now
  res.status(401).json({ message: 'Invalid refresh token' });
};
