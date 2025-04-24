import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation } from '../middlewares/ValidationMiddleware';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { userLogin, userSignup, verifyOtp, testCall, authTestCall } from '../controllers';
import { getDangerZones, getFoodOrgs, getHospitals, getShelters } from '../controllers/GoogleMapController';

const router = express.Router();


router.get('/hospitals', AuthorizeUser, getHospitals)
router.get('/shelters', AuthorizeUser, getShelters)
router.get('/food-orgs', AuthorizeUser, getFoodOrgs)
router.get('/danger-zones', AuthorizeUser, getDangerZones)





export {router as GoogleRoute};