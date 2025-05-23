import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { searchUser, sendConnectionRequest, handleConnectionRequest, getUserConnections } from '../controllers/SocialController';
import { changePassword, deleteAccount, getUserProfile } from '../controllers/UserController';

const router = express.Router();


router.use(AuthorizeUser); // First middleware

router.get('/view-profile', getUserProfile);
router.post('/change-password', changePassword)
router.delete('/delete-account', deleteAccount)
export {router as UserRoute};