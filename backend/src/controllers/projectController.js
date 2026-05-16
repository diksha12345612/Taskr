import prisma from '../config/database.js';

/**
 * Get projects
 * Admins see all projects.
 * Members see only projects they are assigned to.
 * GET /api/projects
 * Access: Private
 */
export const getProjects = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        const where = role === 'Admin' ? {} : {
            members: {
                some: { id }
            }
        };

        const projects = await prisma.project.findMany({
            where,
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: { tasks: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new project
 * POST /api/projects
 * Access: Private (Admin Only)
 */
export const createProject = async (req, res, next) => {
    try {
        const { name, description, status, memberIds } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a project name'
            });
        }

        // Prepare data
        const data = {
            name,
            description,
            status: status || 'Active',
            progress: 0
        };

        // If members are provided, connect them
        if (memberIds && Array.isArray(memberIds)) {
            data.members = {
                connect: memberIds.map(id => ({ id }))
            };
        }

        const project = await prisma.project.create({
            data,
            include: {
                members: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update project members
 * PATCH /api/projects/:id/members
 * Access: Private (Admin Only)
 */
export const updateProjectMembers = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { memberIds } = req.body;

        if (!memberIds || !Array.isArray(memberIds)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of member IDs'
            });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                members: {
                    set: memberIds.map(id => ({ id }))
                }
            },
            include: {
                members: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Project members updated successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a project
 * DELETE /api/projects/:id
 * Access: Private (Admin Only)
 */
export const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if project exists
        const project = await prisma.project.findUnique({
            where: { id }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Delete project
        await prisma.project.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a project
 * PATCH /api/projects/:id
 * Access: Private (Admin, Member)
 */
export const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, status, progress } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (progress !== undefined) updateData.progress = parseInt(progress);

        const project = await prisma.project.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};
