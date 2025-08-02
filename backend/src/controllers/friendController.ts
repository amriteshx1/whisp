import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import FriendRequest from "../models/friendRequest";
import { IUser } from "../models/user";

interface AuthRequest extends Request {
  user?: IUser;
}

// send friend request
export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { to } = req.body;
    const senderId = req.user!._id;

    //can't send to self
    if (to === String(senderId)) {
      res.status(400).json({ message: "can't send a request to yourself" });
      return;
    }

    //find target user
    let targetUser;
    if (mongoose.isValidObjectId(to)) {
      targetUser = await User.findById(to);
    } else {
      targetUser = await User.findOne({ friendCode: to });
    }

    if (!targetUser) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    //check if already friends
    if (targetUser.friends.includes(senderId)) {
      res.status(400).json({ message: "user is already your friend" });
      return;
    }

    //check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, receiverId: targetUser._id, status: "pending" },
        { senderId: targetUser._id, receiverId: senderId, status: "pending" }
      ]
    });

    if (existingRequest) {
      res.status(400).json({ message: "friend request already pending" });
      return;
    }

    //create new friend request
    const newRequest = new FriendRequest({
      senderId,
      receiverId: targetUser._id,
      status: "pending"
    });
    await newRequest.save();

    res.status(201).json({ message: "friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Server error" });
  }
};
