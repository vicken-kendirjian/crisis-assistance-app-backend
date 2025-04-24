import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser, allowUser } from '../middlewares/AuthMiddleware';
import { searchUser, sendConnectionRequest, handleConnectionRequest, getUserConnections, removeConnection, getConnectedUsersInfo } from '../controllers/SocialController';

const router = express.Router();


router.use(AuthorizeUser); // First middleware
router.use(allowUser); // Second middleware


router.get('/search', searchUser )//    /search?phone=%2B961XXXXXXXX
router.post('/connect', sendConnectionRequest)
router.post('/handle-connection', handleConnectionRequest);
router.post('/remove-friend', removeConnection)
router.get('/connections', getUserConnections);
router.get('/connected-locations', getConnectedUsersInfo);


export {router as SocialRoute};