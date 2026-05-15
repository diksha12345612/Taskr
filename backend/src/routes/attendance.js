import express from 'express';
import { checkIn, checkOut, getMyAttendance } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/check-in', checkIn);
router.patch('/check-out', checkOut);
router.get('/me', getMyAttendance);

export default router;
