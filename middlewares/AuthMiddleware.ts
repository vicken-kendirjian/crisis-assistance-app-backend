import express, {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../config';
import { generateAccessToken } from '../utility';
import { UserPayload } from '../dto';

export const AuthorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const userId = req.headers['user-id'];
    console.log("\nUSER ID: "+userId)
    if (!authHeader) {
      return res.status(401).json({ msg: 'No token provided.' });
    }
  
    const accessToken = authHeader.split(' ')[1];
    console.log("\nAT FROM MIDDLEWARE: " + accessToken)
    // Verify the access token
    jwt.verify(accessToken, JWT_SECRET, async (err, decoded) => {
      if (err) { // Access token is invalid or expired
        console.log("\nInvalid access token")
        if (!userId) {
          return res.status(403).json({ msg: 'User ID not provided, unable to refresh token.' });
        }
  
        try {
          // Find User by ID and validate RT
          const user = await User.findById(userId);
  
          if (!user) {
            return res.status(404).json({ msg: 'User not found' });
          }
          console.log("\n USER FOUND")
          const refreshToken = user.refreshToken;
          console.log("\n"+"REFRESH TOKEN: "+refreshToken+"\n")
          if (!refreshToken) {
            return res.status(403).json({ msg: 'No refresh token available, please log in.' });
          }
  
          // Verify the refresh token
          jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err) => {
            if (err) {
              return res.status(403).json({ msg: 'Invalid refresh token, please log in again.' });
            }
  
            // Refresh token is valid
            const payload: UserPayload = {
              _id: user._id.toString(),
              phone: user.phone,
              name: user.name,
            };
  
            const newAccessToken = generateAccessToken(payload);
            console.log("\n NEW ACCESS TOKEN: "+newAccessToken)
            res.setHeader('access-token', newAccessToken); 
  
            
            
            console.log("All good new AT: "+newAccessToken+"\n")
            next(); 
          });
        } catch (e) {
          return res.status(500).json({ msg: 'Server error while processing refresh token.' });
        }
      }
      console.log("ACCESS TOKEN IS VALID")
  
      next(); 
    });
  };

