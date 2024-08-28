import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticateOrNot = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req?.cookies?.auth_user_access_token;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'user is not authenticated',
      });
    }
    const user = await jwt.verify(
      accessToken,
      process.env.ACCESSJWTTOKEN as string
    );
    req.user = user;
    next();
  } catch (error: any) {
    if (error) {
      return res.status(401).json({ message: error.message, success: false });
    }
  }
};
