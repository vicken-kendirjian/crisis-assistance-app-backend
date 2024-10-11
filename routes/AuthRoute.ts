import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { userLogin, userSignup, verifyOtp } from '../controllers';

const router = express.Router();

router.post('/signup', CreateUserValidation, userSignup)
router.post('/verifyotp', OTPValidation, verifyOtp)
router.post('/login', LoginValidation, userLogin)



export {router as AuthRoute};