import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { userLogin, userSignup, verifyOtp, testCall, authTestCall } from '../controllers';
import { getFoodOrgs, getHospitals, getShelters } from '../controllers/GoogleMapController';

const router = express.Router();


router.get('/hostpitals', AuthorizeUser, getHospitals)
router.get('/shelters', AuthorizeUser, getShelters)
router.get('/food-orgs', AuthorizeUser, getFoodOrgs)





export {router as GoogleRoute};