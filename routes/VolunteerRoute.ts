import express, {Request,Response,NextFunction} from 'express';
import { CreateUserValidation, OTPValidation, LoginValidation, VolunteerValidation } from '../middlewares/ValidationMiddleware';
import { ApplyAsVolunteer, getAcceptedApplicants } from '../controllers/VolunteerController';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
const router = express.Router();

router.use(AuthorizeUser);

router.post('/apply', VolunteerValidation, ApplyAsVolunteer)
router.get('/volunteers-accepted', getAcceptedApplicants)




export {router as VolunteerRoute};