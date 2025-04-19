import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, Volunteer } from '../models';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../config';
import { generateAccessToken } from '../utility';
import { UserPayload, VolunteerInput } from '../dto';


export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
  
    try {
      // Find the user by their ID, selecting only needed fields
      const user = await User.findById(userId).select('name lastname bloodType phone');
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found', token });
      }
  
      return res.status(200).json({
        profile: {
          name: user.name,
          lastname: user.lastname,
          bloodType: user.bloodType,
          phone: user.phone,
        },
        token,
      });
    } catch (err) {
      return res.status(500).json({ msg: 'Server error', token });
    }
  };
  