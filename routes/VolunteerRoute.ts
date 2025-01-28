import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation, VolunteerValidation } from '../middlewares/ValidationMiddleware';
import { ApplyAsVolunteer } from '../controllers/VolunteerController';
import { allowUser, AuthorizeUser } from '../middlewares/AuthMiddleware';
const router = express.Router();

router.use(AuthorizeUser);
router.use(allowUser);

router.post('/apply', VolunteerValidation, ApplyAsVolunteer)




export {router as VolunteerRoute};