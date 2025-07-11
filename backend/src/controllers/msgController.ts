import { Request, Response } from "express";
import User from "../models/user";
import Message from "../models/message";
import { IUser } from "../models/user";
import cloudinary from "../lib/cloudinary";
import { io, userSocketMap } from "..";

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
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
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

//mark messages as seen
export const markSeen = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})  
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

//send message to user
export const sendMsg = async (req: AuthRequest, res: Response) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user?._id;

        let imgUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }

        const newMsg = await Message.create({
            senderId,
            receiverId,
            text,
            image: imgUrl
        })

        //emit new msg to receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMsg);
        }

        res.json({success: true, newMsg});
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}