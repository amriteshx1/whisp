import { Request, Response } from "express";
import { generateToken } from "../lib/utils";
import User, { IUser } from "../models/user";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary";

interface AuthRequest extends Request {
  user?: IUser;
}

// A helper function to generate a unique friend code
const generateFriendCode = async (): Promise<string> => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  let exists = true;

  while (exists) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existingUser = await User.findOne({ friendCode: code });
    if (!existingUser) {
      exists = false;
    }
  }
  return code;
};

// Register a new user
export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      res.status(400).json({ success: false, message: "Missing details!" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "Account already exists!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const friendCode = await generateFriendCode();

    const newUser: IUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
      friendCode,
    });

    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully!",
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Login a user
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        if (!userData) {
          res.status(404).json({ success: false, message: "Account not found!" });
          return;
        }

        if (!userData.password) {
          res.status(500).json({ success: false, message: "User data is missing a password." });
          return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            res.status(401).json({ success: false, message: "Invalid credentials!" });
            return;
        }

        const token = generateToken(userData._id.toString());

        res.status(200).json({
          success: true,
          userData,
          token,
          message: "Login successful!",
        });
    } catch (error: any) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

//controller to check if user is authenticated
export const checkAuth = (req: AuthRequest, res: Response) => {
  res.json({ success: true, user: req.user });
};

// Controller to update user profile details
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user?._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};