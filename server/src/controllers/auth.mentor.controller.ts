import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/db';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { Role } from '@prisma/client';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, phone, company, currentPosition, yearsOfExperience, industry, bio, linkedinUrl, availability, profilePicture } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.MENTOR,
        mentorProfile: {
          create: {
            fullName,
            phone,
            company,
            currentPosition,
            yearsOfExperience: parseInt(yearsOfExperience),
            industry,
            bio,
            linkedinUrl,
            availability: JSON.stringify(availability || []),
            profilePicture
          }
        }
      }
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    res.status(201).json({
      message: 'Mentor registered successfully',
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== Role.MENTOR) {
      res.status(401).json({ message: 'Invalid credentials or incorrect role' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = (req: Request, res: Response): void => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.role !== Role.MENTOR) {
       res.status(403).json({ message: 'Invalid role' });
       return;
    }

    const tokens = generateTokens(decoded.userId, decoded.role);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (req: Request, res: Response): void => {
  // Client is expected to discard the tokens
  res.json({ message: 'Logged out successfully' });
};
