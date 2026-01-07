import { prisma } from "../lib/prisma.js"; // instead of new PrismaClient()
export const getPendingLawyers = async (req, res) => {
    try {
        const pendingLawyers = await prisma.lawyerProfile.findMany({
            where: { status: "PENDING" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.json(pendingLawyers);
    }
    catch (error) {
        console.error("Get pending lawyers error:", error);
        res.status(500).json({ error: "Failed to fetch pending applications" });
    }
};
export const approveLawyer = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await prisma.lawyerProfile.update({
            where: { id },
            data: { status: "APPROVED" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            message: "Lawyer approved successfully",
            profile
        });
    }
    catch (error) {
        console.error("Approve lawyer error:", error);
        res.status(500).json({ error: "Failed to approve lawyer" });
    }
};
export const rejectLawyer = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const profile = await prisma.lawyerProfile.update({
            where: { id },
            data: { status: "REJECTED" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        // In a real app, you'd send an email with the reason
        console.log(`Lawyer ${profile.userId} rejected. Reason: ${reason}`);
        res.json({
            success: true,
            message: "Lawyer application rejected",
            profile
        });
    }
    catch (error) {
        console.error("Reject lawyer error:", error);
        res.status(500).json({ error: "Failed to reject lawyer" });
    }
};
export const flagPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const post = await prisma.legalPost.update({
            where: { id },
            data: { status: "FLAGGED" },
        });
        // Log the flag reason
        console.log(`Post ${id} flagged by admin. Reason: ${reason}`);
        res.json({
            success: true,
            message: "Post flagged successfully",
            post
        });
    }
    catch (error) {
        console.error("Flag post error:", error);
        res.status(500).json({ error: "Failed to flag post" });
    }
};
