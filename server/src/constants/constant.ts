import dotenv from 'dotenv';
import path from 'path';
import { IENV } from '../types/type';
dotenv.config({
  path: path.join(__dirname, '../config/.env'),
});

export const ENV: IENV = {
  PORT: process.env.PORT || '8066',
  MONGODB_URI: process.env.MONGODB_URI || '',
  CORS_ORIGIN_ACCESS: process.env.CORS_ORIGIN_ACCESS || '',
};
