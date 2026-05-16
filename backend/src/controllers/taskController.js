import prisma from '../config/database.js';

/**
 * Get all tasks with optional project filtering
 * GET /api/tasks
 * Access: Private (Admin & Member)
 */
export const getTasks = async (req, res, next) => {
    try {
        const { projectId } = req.query;
        const { id, role } = req.user;

        // Construct where clause
        const whereClause = {};
        if (projectId) {
            whereClause.projectId = projectId;
        }

        // Members can only see their assigned tasks
        if (role === 'Member') {
            whereClause.assigneeId = id;
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new task
 * POST /api/tasks
 * Access: Private (Admin Only)
 */
export const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, projectId, assigneeId, dueDate } = req.body;

        // Validation
        if (!title || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both title and projectId'
            });
        }

        // Verify project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'Medium',
                projectId,
                assigneeId,
                dueDate: dueDate ? new Date(dueDate) : null,
                status: 'Todo'
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update task status
 * PATCH /api/tasks/:id/status
 * Access: Private (Admin & Member)
 */
export const updateTaskStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status enum
        const validStatuses = ['Todo', 'InProgress', 'Completed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Check if task exists
        const task = await prisma.task.findUnique({
            where: { id }
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Authorization: Member can only update their own assigned tasks
        if (req.user.role === 'Member' && task.assigneeId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update tasks assigned to you.'
            });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            data: updatedTask
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 * Access: Private (Admin Only)
 */
export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if task exists
        const task = await prisma.task.findUnique({
            where: { id }
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        await prisma.task.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get dashboard stats
 * GET /api/tasks/stats
 * Access: Private
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const now = new Date();

        const where = role === 'Member' ? { assigneeId: id } : {};

        const [totalTasks, tasksByStatus, overdueTasks, tasksPerUser] = await Promise.all([
            prisma.task.count({ where }),
            prisma.task.groupBy({
                by: ['status'],
                where,
                _count: true
            }),
            prisma.task.count({
                where: {
                    ...where,
                    dueDate: { lt: now },
                    status: { not: 'Completed' }
                }
            }),
            role === 'Admin' ? prisma.task.groupBy({
                by: ['assigneeId'],
                _count: true
            }) : null
        ]);

        // Format tasksPerUser if Admin
        let formattedTasksPerUser = [];
        if (role === 'Admin' && tasksPerUser) {
            const users = await prisma.user.findMany({
                where: { id: { in: tasksPerUser.map(t => t.assigneeId).filter(Boolean) } },
                select: { id: true, name: true }
            });

            formattedTasksPerUser = tasksPerUser.map(t => {
                const user = users.find(u => u.id === t.assigneeId);
                return {
                    userName: user ? user.name : 'Unassigned',
                    count: t._count
                };
            });
        }

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                tasksByStatus: tasksByStatus.reduce((acc, curr) => {
                    acc[curr.status] = curr._count;
                    return acc;
                }, {}),
                overdueTasks,
                tasksPerUser: formattedTasksPerUser
            }
        });
    } catch (error) {
        next(error);
    }
};
