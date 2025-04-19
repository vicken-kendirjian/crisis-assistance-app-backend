import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser, allowUser } from '../middlewares/AuthMiddleware';
import { searchUser, sendConnectionRequest, handleConnectionRequest, getUserConnections } from '../controllers/SocialController';
import { changePassword, deleteAccount, getUserProfile } from '../controllers/UserController';

const router = express.Router();


router.use(AuthorizeUser); // First middleware
router.use(allowUser); // Second middleware


router.get('/view-profile', getUserProfile);
router.post('/change-password', changePassword)
router.post('/delete-account', deleteAccount)
export {router as UserRoute};