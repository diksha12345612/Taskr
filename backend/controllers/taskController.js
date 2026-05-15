const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'Admin') {
      // Admins see all tasks they created or in projects they manage
      query = Task.find({ createdBy: req.user.id }).populate('project assignedTo', 'name email');
    } else {
      // Members see tasks assigned to them
      query = Task.find({ assignedTo: req.user.id }).populate('project createdBy', 'name email');
    }

    const tasks = await query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    // Check if project exists and user is admin of it
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to create tasks for this project' });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Only assigned user or admin can update status
    if (
      task.assignedTo.toString() !== req.user.id &&
      req.user.role !== 'Admin'
    ) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    let match = {};
    if (req.user.role !== 'Admin') {
      match.assignedTo = req.user.id;
    } else {
      match.createdBy = req.user.id;
    }

    const stats = await Task.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const overdueCount = await Task.countDocuments({
      ...match,
      status: { $ne: 'Done' },
      dueDate: { $lt: new Date() },
    });

    res.status(200).json({
      success: true,
      data: {
        stats,
        overdueCount,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
