import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// @desc    Check in for the day
// @route   POST /api/attendance/check-in
// @access  Private
export const checkIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const existing = await prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today
                }
            }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: 'Already checked in for today' });
        }

        const attendance = await prisma.attendance.create({
            data: {
                userId,
                date: today,
                checkIn: new Date(),
                status: 'Present'
            }
        });

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Check out for the day
// @route   PATCH /api/attendance/check-out
// @access  Private
export const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await prisma.attendance.update({
            where: {
                userId_date: {
                    userId,
                    date: today
                }
            },
            data: {
                checkOut: new Date()
            }
        });

        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        res.status(400).json({ success: false, message: 'No check-in record found for today' });
    }
};

// @desc    Get user attendance history
// @route   GET /api/attendance/me
// @access  Private
export const getMyAttendance = async (req, res) => {
    try {
        const attendance = await prisma.attendance.findMany({
            where: { userId: req.user.id },
            orderBy: { date: 'desc' },
            take: 30
        });
        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
