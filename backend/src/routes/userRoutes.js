import express from 'express';
import { getUsers, adminCreateUser, deleteUser } from '../controllers/userController.js';

import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getUsers);
router.post('/', authenticate, authorize('Admin'), adminCreateUser);
router.delete('/:id', authenticate, authorize('Admin'), deleteUser);

export default router;

