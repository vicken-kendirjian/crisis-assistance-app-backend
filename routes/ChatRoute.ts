import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { userLogin, userSignup, verifyOtp, testCall, authTestCall } from '../controllers';
import { getFoodOrgs, getHospitals, getShelters } from '../controllers/GoogleMapController';
import { generateReply } from '../controllers/ChatController';

const router = express.Router();


router.post('/chat-reply', AuthorizeUser, generateReply)





export {router as ChatRoute};