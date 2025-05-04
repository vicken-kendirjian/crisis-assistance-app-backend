import express, {Request,Response,NextFunction} from 'express';
import { AuthorizeAdmin, AuthorizeUser } from '../middlewares/AuthMiddleware';
import { getUserInfoById, adminDeleteUserAccount, deleteVolunteerById, deleteDangerZoneByCoordinates,getAllUsers, getAdminAcceptedApplicants, getPendingApplicants, setDangerZone, updateApplicationStatus, getUserConnectionsByAdmin } from '../controllers/AdminController';
import { getUserConnections } from '../controllers/SocialController';
import { getAcceptedApplicants } from '../controllers/VolunteerController';

const router = express.Router();


router.use(AuthorizeAdmin); // First middleware


router.get('/all-pending-applicants', getPendingApplicants),
router.get('/all-accepted-applicants', getAdminAcceptedApplicants),
router.post('/update-status', updateApplicationStatus)
router.get('/get-all-users', getAllUsers),
router.post('/set-danger-zone', setDangerZone)
router.post('/delete-danger-zone', deleteDangerZoneByCoordinates)
router.post('/get-user-connections', getUserConnectionsByAdmin)
router.delete('/volunteers/:volunteerId', deleteVolunteerById);
router.delete('/delete-user/:userId', adminDeleteUserAccount);
router.get('/user/:userId', getUserInfoById);



export {router as AdminRoute};