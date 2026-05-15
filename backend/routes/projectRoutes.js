const express = require('express');
const {
  getProjects,
  createProject,
  addMember,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getProjects).post(authorize('Admin'), createProject);
router.put('/:id/add-member', authorize('Admin'), addMember);

module.exports = router;
