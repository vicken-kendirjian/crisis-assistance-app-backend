import express, {Request,Response,NextFunction} from 'express';
import { AuthorizeUser } from '../middlewares/AuthMiddleware';
import { deleteDangerZoneByCoordinates, getAllApplicants, getAllUsers, setDangerZone, updateApplicationStatus } from '../controllers/AdminController';
import { getUserConnections } from '../controllers/SocialController';

const router = express.Router();


router.use(AuthorizeUser); // First middleware


router.get('/all-applicants', getAllApplicants)
router.post('/update-status', updateApplicationStatus)
router.get('/get-all-users', getAllUsers),
router.post('/set-danger-zone', setDangerZone)
router.post('/delete-danger-zone', deleteDangerZoneByCoordinates)
router.post('/get-user-connections', getUserConnections)


export {router as AdminRoute};