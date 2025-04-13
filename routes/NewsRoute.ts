import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { userLogin, userSignup, verifyOtp, testCall, authTestCall } from '../controllers';
import { getFoodOrgs, getHospitals, getShelters } from '../controllers/GoogleMapController';
import { getNews } from '../controllers/NewsController';

const router = express.Router();


router.get('/fetch', getNews)






export {router as NewsRoute};