import express from 'express';
import { requestLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', requestLeave);
router.get('/me', getMyLeaves);

// Admin only routes
router.get('/', authorize('Admin'), getAllLeaves);
router.patch('/:id', authorize('Admin'), updateLeaveStatus);

export default router;
