import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  BCRYPT_WORK_FACTOR: process.env.NODE_ENV === 'test' ? 1 : 12,
};
