import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation, VolunteerValidation } from '../middlewares/ValidationMiddleware';
import { ApplyAsVolunteer } from '../controllers/VolunteerController';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
const router = express.Router();

router.post('/apply', AuthorizeUser, VolunteerValidation, ApplyAsVolunteer)




export {router as VolunteerRoute};