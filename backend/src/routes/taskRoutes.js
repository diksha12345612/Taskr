import express from 'express';
import { getTasks, createTask, updateTaskStatus, deleteTask, getDashboardStats } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/tasks/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', authenticate, getDashboardStats);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (with optional ?projectId= filter)
 * @access  Private (Admin, Member)
 */
router.get('/', authenticate, getTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private (Admin Only)
 */
router.post('/', authenticate, allowRoles('Admin'), createTask);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status
 * @access  Private (Admin, Member)
 */
router.patch('/:id/status', authenticate, allowRoles('Admin', 'Member'), updateTaskStatus);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private (Admin Only)
 */
router.delete('/:id', authenticate, allowRoles('Admin'), deleteTask);

export default router;
