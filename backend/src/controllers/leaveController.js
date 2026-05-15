import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// @desc    Submit a leave request
// @route   POST /api/leaves
// @access  Private
export const requestLeave = async (req, res) => {
    try {
        const { type, startDate, endDate, reason } = req.body;
        
        const leave = await prisma.leaveRequest.create({
            data: {
                userId: req.user.id,
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: 'Pending'
            }
        });

        res.status(201).json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my leave requests
// @route   GET /api/leaves/me
// @access  Private
export const getMyLeaves = async (req, res) => {
    try {
        const leaves = await prisma.leaveRequest.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all leave requests (Admin only)
// @route   GET /api/leaves
// @access  Private/Admin
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await prisma.leaveRequest.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update leave status (Approve/Reject)
// @route   PATCH /api/leaves/:id
// @access  Private/Admin
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leave = await prisma.leaveRequest.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
