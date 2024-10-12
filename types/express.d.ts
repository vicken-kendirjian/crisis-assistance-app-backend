import { Request } from 'express';
import mongoose from 'mongoose';

// Declare global namespace for Express
declare global {
  namespace Express {
    interface Request {
      userId?: string | mongoose.Types.ObjectId; // Optional property for user ID
    }
  }
}
