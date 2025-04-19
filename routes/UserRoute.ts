import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser, allowUser } from '../middlewares/AuthMiddleware';
import { searchUser, sendConnectionRequest, handleConnectionRequest, getUserConnections } from '../controllers/SocialController';
import { getUserProfile } from '../controllers/UserController';

const router = express.Router();


router.use(AuthorizeUser); // First middleware
router.use(allowUser); // Second middleware


router.get('/view-profile', getUserProfile);
export {router as UserRoute};