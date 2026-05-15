const express = require('express');
const {
  getTasks,
  createTask,
  updateTaskStatus,
  getStats,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getTasks).post(authorize('Admin'), createTask);
router.get('/stats', getStats);
router.put('/:id', updateTaskStatus);

module.exports = router;
