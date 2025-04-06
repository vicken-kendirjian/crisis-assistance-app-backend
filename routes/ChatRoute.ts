import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { userLogin, userSignup, verifyOtp, testCall, authTestCall } from '../controllers';
import { getFoodOrgs, getHospitals, getShelters } from '../controllers/GoogleMapController';
import { generateReply, saveChatLog } from '../controllers/ChatController';

const router = express.Router();


router.post('/chat-reply', AuthorizeUser, generateReply)
router.post('/save-chat', AuthorizeUser, saveChatLog)





export {router as ChatRoute};