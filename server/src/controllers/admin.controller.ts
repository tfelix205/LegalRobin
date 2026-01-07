import type {Response, Request} from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const approveLawyer = async (req: Request, res: Response) => {
  await prisma.lawyerProfile.update({
    where: { id: req.params.id },
    data: { status: "APPROVED" },
  });

  res.json({ success: true });
};
