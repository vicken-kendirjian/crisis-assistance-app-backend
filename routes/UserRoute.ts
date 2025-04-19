import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation, VolunteerValidation } from '../middlewares/ValidationMiddleware';
import { ApplyAsVolunteer, getAcceptedApplicants } from '../controllers/VolunteerController';
import { allowUser, AuthorizeUser } from '../middlewares/AuthMiddleware';
import { getUser } from '../controllers/UserController';


const router = express.Router();

router.use(AuthorizeUser);
router.use(allowUser);


router.get('/profile', getUser)




export {router as UserRoute};