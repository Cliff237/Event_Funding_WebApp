import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient();

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const profile = req.file ? req.file.path : null;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, profile },
    });

    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user.id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};
