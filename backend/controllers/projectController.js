const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'Admin') {
      query = Project.find({ admin: req.user.id }).populate('members', 'name email');
    } else {
      query = Project.find({ members: req.user.id }).populate('admin', 'name email');
    }

    const projects = await query;

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    req.body.admin = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/add-member
// @access  Private/Admin
exports.addMember = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Make sure user is project admin
    if (project.admin.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
    }

    const { email } = req.body;
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ success: false, message: 'User already a member of this project' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
