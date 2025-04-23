import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { userLogin, userSignup, verifyOtp, testCall, authTestCall, checkStartup, logout } from '../controllers';

const router = express.Router();

router.post('/signup', CreateUserValidation, userSignup)
router.post('/verifyotp', OTPValidation, verifyOtp)
router.post('/login', LoginValidation, userLogin)

router.post('/check-token', AuthorizeUser, checkStartup)
router.get('/test', testCall)
router.get('/authotest', AuthorizeUser, authTestCall)
router.post('/logout', logout)


export {router as AuthRoute};