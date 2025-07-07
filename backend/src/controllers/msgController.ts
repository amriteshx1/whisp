import { Request, Response } from "express";
import User from "../models/user";
import Message from "../models/message";
import { IUser } from "../models/user";

interface AuthRequest extends Request {
  user?: IUser;
}

// Get all users except logged-in user, along with unseen message count
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userID = req.user!._id;

    const allUsers = await User.find({ _id: { $ne: userID } }).select("-password");

    const unseenMsg: Record<string, number> = {};

    const promises = allUsers.map(async (user) => {
      const msgs = await Message.find({
        senderId: user._id,
        receiverId: userID,
        seen: false,
      });

      if (msgs.length > 0) {
        unseenMsg[user._id.toString()] = msgs.length;
      }
    });

    await Promise.all(promises);

    res.json({ success: true, users: allUsers, unseenMsg });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all messages from selected user
export const getMsg = async (req: AuthRequest, res: Response) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user?._id;

    if (!myId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const msgs = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, msgs });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};