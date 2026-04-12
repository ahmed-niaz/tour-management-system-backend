import express from 'express'
import { checkAuth } from '../../middlewares/check.auth';
import { Role } from '../user/user.interface';
import { statsController } from './stats.controller';

const router = express.Router();

router.get('/booking', checkAuth(Role.ADMIN,Role.SUPER_ADMIN), statsController.getBookingStats);
router.get('/payment', checkAuth(Role.ADMIN,Role.SUPER_ADMIN), statsController.getPaymentStats);
router.get('/user', checkAuth(Role.ADMIN,Role.SUPER_ADMIN), statsController.getUserStats);
router.get('/tour', checkAuth(Role.ADMIN,Role.SUPER_ADMIN), statsController.getTourStats);


export const statsRoutes = router;