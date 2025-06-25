import { Request, Response } from "express";
import { generateToken } from "../lib/utils";
import User, { IUser } from "../models/user";
import bcrypt from "bcryptjs";

interface AuthRequest extends Request {
  user?: IUser;
}

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

//Login a user
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        if (!userData) {
          return res.status(404).json({ success: false, message: "Account not found!" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        const token = generateToken(userData._id.toString());

        return res.status(200).json({
          success: true,
          userData,
          token,
          message: "Login successful!",
        });
    } catch (error: any) {
        console.error("Login error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//controller to check if user is authenticated
export const checkAuth = (req: AuthRequest, res: Response) => {
  res.json({ success: true, user: req.user });
};