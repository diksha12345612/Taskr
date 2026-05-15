import prisma from '../config/database.js';

/**
 * Get all projects with task counts
 * GET /api/projects
 * Access: Private (Admin & Member)
 */
export const getProjects = async (req, res, next) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
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
        const { name, description, status } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a project name'
            });
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                status: status || 'Active',
                progress: 0 // Initial progress
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

        // Delete project (cascades to tasks if configured in schema)
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
