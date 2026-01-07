import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import type {Response, Request} from "express";

export const respondToPost = async (req: Request, res: Response) => {
  const lawyer = await prisma.lawyerProfile.findUnique({
    where: { userId: req.user.id },
  });

  if (!lawyer || lawyer.status !== "APPROVED") {
    return res.status(403).json({ error: "Lawyer not verified" });
  }

  const response = await prisma.response.create({
    data: {
      postId: req.params.postId,
      lawyerId: req.user.id,
      message: req.body.message,
    },
  });

  res.json(response);
};
