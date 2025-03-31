import express, {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../config';
import { generateAccessToken } from '../utility';
import { UserPayload } from '../dto';

export const AuthorizeUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const userId = req.headers['user-id'];
  
  console.log("\nUSER ID: " + userId);
  
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token provided.' });
  }

  const accessToken = authHeader.split(' ')[1];
  console.log("\nAT FROM MIDDLEWARE: " + accessToken);

  if (!userId) {
    return res.status(403).json({ msg: 'User ID not provided, unable to refresh token.' });
  }
  const user = await User.findById(userId);

  if(accessToken!==user?.accessToken){
    return res.status(500).json({msg: "Dear malicious user get shit on"})
  }

  try {
    // Verify the access token synchronously
    const payload = jwt.verify(accessToken, JWT_SECRET) as UserPayload; // Sync verification

    console.log("ACCESS TOKEN IS VALID");
    req.userId = payload._id;
    req.nat = accessToken
    return next(); // If valid, proceed

  } catch (err) {
    // If access token is invalid or expired, check the refresh token
    console.log("\nInvalid access token");
    
    try {
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      console.log("\nUSER FOUND");
      const refreshToken = user.refreshToken;
      console.log("\nREFRESH TOKEN: " + refreshToken);
      
      if (!refreshToken) {
        return res.status(403).json({ msg: 'No refresh token available, please log in.' });
      }

      // Verify the refresh token synchronously
      try {
        jwt.verify(refreshToken, JWT_REFRESH_SECRET); // Sync verification for refresh token

        // If refresh token is valid, generate a new access token
        const payload: UserPayload = {
          _id: user._id.toString(),
          phone: user.phone,
          name: user.name,
          isAdmin: user.isAdmin
        };

        const newAccessToken = generateAccessToken(payload);

        user.accessToken = newAccessToken;
        await user.save();

        console.log("\nNEW ACCESS TOKEN: " + newAccessToken);
        // req.nat = newAccessToken

        req.userId = user._id;
        console.log("All good, new AT: " + newAccessToken + "\n");
        req.nat = newAccessToken
        return next(); // Proceed to the next middleware or route handler

      } catch (refreshErr) {
        return res.status(403).json({ msg: 'Invalid refresh token, please log in again.' });
      }

    } catch (e) {
      return res.status(500).json({ msg: 'Server error while processing refresh token.' });
    }
  }
};





export const allowAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(403).json({ msg: 'User ID not provided, unable to refresh token.' });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (!user.isAdmin) {
    return res.status(403).send({ error: 'Admins only' });
  }

  next();
};


export const allowUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(403).json({ msg: 'User ID not provided, unable to refresh token.' });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (user.isAdmin) {
    return res.status(403).send({ error: 'Users only' });
  }

  next();
};