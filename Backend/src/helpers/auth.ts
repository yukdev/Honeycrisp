import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '@prisma/client';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.BCRYPT_WORK_FACTOR);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, config.SECRET_KEY);
};
