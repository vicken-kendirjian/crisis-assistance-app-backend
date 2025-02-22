import express, {Request,Response,NextFunction} from 'express';
import { AuthorizeUser, allowAdmin, allowUser } from '../middlewares/AuthMiddleware';
import { getAllApplicants } from '../controllers/AdminController';

const router = express.Router();


router.use(AuthorizeUser); // First middleware
router.use(allowAdmin); // Second middleware


router.get('/all-applicants', getAllApplicants)


export {router as AdminRoute};