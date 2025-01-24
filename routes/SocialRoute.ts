import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { searchUser, sendConnectionRequest, handleConnectionRequest, getUserConnections } from '../controllers/SocialController';

const router = express.Router();



router.get('/search', AuthorizeUser, searchUser )
router.post('/connect', AuthorizeUser, sendConnectionRequest)
router.post('/handle-connection', AuthorizeUser, handleConnectionRequest);
router.get('/connections', AuthorizeUser, getUserConnections);

export {router as SocialRoute};