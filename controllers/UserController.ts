import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, Volunteer } from '../models';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../config';
import { generateAccessToken } from '../utility';
import { UserPayload, VolunteerInput } from '../dto';
import { GeneratePassword, GenerateSalt } from '../utility';

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


  export const changePassword = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
    const { oldPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found', token });
      }
  
      // Recreate the hash using the user's salt
      const hashedOld = await GeneratePassword(oldPassword, user.salt);
  
      if (hashedOld !== user.password) {
        return res.status(400).json({ msg: 'Incorrect current password', token });
      }
  
      // Hash and update with the new password
      const newSalt = await GenerateSalt();
      const hashedNew = await GeneratePassword(newPassword, newSalt);
  
      user.password = hashedNew;
      user.salt = newSalt;
  
      await user.save();
  
      return res.status(200).json({ msg: 'Password updated successfully', token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Server error', token });
    }
  };
  