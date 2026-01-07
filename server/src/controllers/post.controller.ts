import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";
import { containsIllegalContent } from "../utils/moderation.js";



export async function createPost(req: Request, res: Response) {
  try {
    const { category, description } = req.body;

    if (!category || !description) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Check for illegal content
    if (containsIllegalContent(description)) {
      return res.status(400).json({ 
        error: "Your post contains inappropriate content" 
      });
    }

    const post = await prisma.legalPost.create({
      data: {
        category,
        description,
        userId: req.user?.id,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
}

export async function getAllPosts(req: Request, res: Response) {
  try {
    const { category, status } = req.query;

    const posts = await prisma.legalPost.findMany({
      where: {
        ...(category && { category: category as string }),
        ...(status && { status: status as any }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        responses: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const post = await prisma.legalPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        responses: {
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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
}