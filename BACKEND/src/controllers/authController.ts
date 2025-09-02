import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import {PrismaClient} from "@prisma/client"
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const profile = req.file?.path; // multer sets this

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile,
      },
    });

    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
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

    // Super Admin check
    if (user.role === "SUPER_ADMIN") {
      // Optional: hardcode Super Admin credentials (or check in DB)
      if (email !== process.env.SUPER_ADMIN_EMAIL || password !== process.env.SUPER_ADMIN_PASSWORD) {
        return res.status(403).json({ message: "Super Admin credentials incorrect" });
      }
    } else {
      // Check hashed password for other roles
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    }
      
    const token = generateToken(user.id);
    res.status(200).json({ user, token });
    return res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};