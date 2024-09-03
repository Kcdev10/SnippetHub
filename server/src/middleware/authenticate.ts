import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserPayload } from '../types/type';

export interface CustomRequest extends Request {
  user: JwtPayload;
}

export const isAuthenticateOrNot = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken =
      req?.cookies?.auth_user_access_token ||
      (req.headers.authorization?.split('Bearer')[1].trim() as string);
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'user is not authenticated',
      });
    }
    const user = (await jwt.verify(
      accessToken,
      process.env.ACCESSJWTTOKEN as string
    )) as UserPayload;

    if (user && typeof user !== 'string') {
      req.user = user;
    }

    next();
  } catch (error) {
    if (error && error instanceof Error) {
      return res.status(401).json({ message: error.message, success: false });
    }
  }
};
