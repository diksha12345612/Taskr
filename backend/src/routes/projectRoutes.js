import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, updateProjectMembers } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Private (Admin, Member)
 */
router.get('/', authenticate, getProjects);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (Admin Only)
 */
router.post('/', authenticate, allowRoles('Admin'), createProject);
router.patch('/:id', authenticate, updateProject);

/**
 * @route   PATCH /api/projects/:id/members
 * @desc    Update project members
 * @access  Private (Admin Only)
 */
router.patch('/:id/members', authenticate, allowRoles('Admin'), updateProjectMembers);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private (Admin Only)
 */
router.delete('/:id', authenticate, allowRoles('Admin'), deleteProject);

export default router;
