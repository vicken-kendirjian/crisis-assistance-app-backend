import jwt from 'jsonwebtoken';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../config';
import { UserPayload } from '../dto';

export const generateAccessToken = (payload: UserPayload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};
  
export const generateRefreshToken = (payload: UserPayload) => {
    return jwt.sign({ payload }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};


