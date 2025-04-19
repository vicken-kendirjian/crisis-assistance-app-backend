import express, {Request,Response,NextFunction} from 'express';
import { allowUser, AuthorizeUser } from '../middlewares/AuthMiddleware';
import { getUser } from '../controllers/UserController';


const router = express.Router();

router.use(AuthorizeUser);
router.use(allowUser);


router.get('/getinfo', getUser)




export {router as UserRoute};