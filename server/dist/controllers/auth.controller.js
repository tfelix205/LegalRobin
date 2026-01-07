import { prisma } from "../lib/prisma.js"; // instead of new PrismaClient()
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.js";
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
            role: role || Role.USER,
        },
    });
    res.json(user);
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ error: "User not found" });
    const valid = await comparePassword(password, user.password);
    if (!valid)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
};
