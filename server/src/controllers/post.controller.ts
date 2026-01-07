import  { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export async function createPost(req: Request, res: Response) {
  const { category, description } = req.body;

  if (!category || !description) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const post = await prisma.legalPost.create({
    data: {
      category,
      description,
      userId: req.user?.id
    }
  });

  res.json(post);
}
