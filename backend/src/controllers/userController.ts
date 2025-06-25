import { Request, Response } from "express";
import { generateToken } from "../lib/utils";
import User, { IUser } from "../models/user";
import bcrypt from "bcryptjs";

// Register a new user
export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({ success: false, message: "Missing details!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Account already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id.toString());

    return res.status(201).json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully!",
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};