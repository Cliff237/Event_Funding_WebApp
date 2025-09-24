import express from "express";
const { Request, Response } = express;
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";
import {PrismaClient} from "@prisma/client"
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

// SignUp
export const signUp = async (req,res) => {
  try {
    const { name, email, password } = req.body;
    const profile = req.file?.path;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, profile, role: "SCHOOL_ORGANIZER" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true
      }
    });

    // console.log("Created user:", {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    //   profile: user.profile
    // });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, profile: user.profile, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Retrieved user:", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    });

    // 🔑 Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🎫 Generate token with id, role, name
    console.log("Generating token with:", { id: user.id, role: user.role, name: user.name });
    const token = generateToken({
      id: user.id,
      role: user.role,
      name: user.name
    });

    console.log("Login successful ✅");

    // 📦 Send token + user (without password!)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    const profile = req.file?.path;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (profile) updateData.profile = profile;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true
      }
    });

    console.log("Profile updated:", updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    console.log("Password changed successfully for user:", userId);

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

