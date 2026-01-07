import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";
export const applyAsLawyer = async (req, res) => {
    try {
        const { specialization, jurisdiction, licenseUrl } = req.body;
        if (!specialization || !jurisdiction || !licenseUrl) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Check if user already has a lawyer profile
        const existingProfile = await prisma.lawyerProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (existingProfile) {
            return res.status(400).json({
                error: "You already have a lawyer application",
                status: existingProfile.status
            });
        }
        // Create lawyer profile
        const profile = await prisma.lawyerProfile.create({
            data: {
                userId: req.user.id,
                specialization,
                jurisdiction,
                licenseUrl,
            },
        });
        // Update user role to LAWYER
        await prisma.user.update({
            where: { id: req.user.id },
            data: { role: Role.LAWYER },
        });
        res.status(201).json({
            message: "Application submitted successfully",
            profile,
        });
    }
    catch (error) {
        console.error("Apply as lawyer error:", error);
        res.status(500).json({ error: "Failed to submit application" });
    }
};
export const respondToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        // Check if lawyer profile exists and is approved
        const lawyer = await prisma.lawyerProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!lawyer || lawyer.status !== "APPROVED") {
            return res.status(403).json({
                error: "Only verified lawyers can respond to posts"
            });
        }
        // Check if post exists
        const post = await prisma.legalPost.findUnique({
            where: { id: postId },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Create response
        const response = await prisma.response.create({
            data: {
                postId,
                lawyerId: req.user.id,
                message,
            },
            include: {
                lawyer: {
                    select: {
                        id: true,
                        name: true,
                        lawyerProfile: {
                            select: {
                                specialization: true,
                                jurisdiction: true,
                            },
                        },
                    },
                },
            },
        });
        // Update post status to ANSWERED if this is the first response
        const responseCount = await prisma.response.count({
            where: { postId },
        });
        if (responseCount === 1) {
            await prisma.legalPost.update({
                where: { id: postId },
                data: { status: "ANSWERED" },
            });
        }
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Respond to post error:", error);
        res.status(500).json({ error: "Failed to submit response" });
    }
};
export const getLawyerProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await prisma.lawyerProfile.findUnique({
            where: { userId },
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
        });
        if (!profile) {
            return res.status(404).json({ error: "Lawyer profile not found" });
        }
        res.json(profile);
    }
    catch (error) {
        console.error("Get lawyer profile error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};
