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

    res.json({ success: true, users: allUsers, unseenMessages: unseenMsg });
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
      { senderId: selectedUserId, receiverId: myId, status: { $ne: "seen"} },
      { seen: true, status: "seen" }
    );

    const updatedMessageIds = (await Message.find({
        senderId: selectedUserId,
        receiverId: myId,
        status: "seen"
    }).select('_id')).map(msg => msg._id);

    const senderSocketId = userSocketMap[selectedUserId.toString()];
    if (senderSocketId && updatedMessageIds.length > 0) {
        io.to(senderSocketId).emit("messageStatusUpdateBulk", {
            ids: updatedMessageIds,
            status: "seen"
        });
    };

    res.json({ success: true, messages: msgs });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//mark messages as seen
export const markSeen = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { seen: true, status: "seen" },
            { new: true } 
        );

        if (!updatedMessage) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        // notify the sender that their message was seen
        const senderSocketId = userSocketMap[updatedMessage.senderId.toString()];
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageStatusUpdate", {
                id: updatedMessage._id,
                status: "seen"
            });
        }
        res.json({success: true, message: updatedMessage })  
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
            image: imgUrl,
            status: "delivered"
        })

        //emit new msg to receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMsg);
        }

        // to sender with current status
        if (senderId) {
            const senderSocketId = userSocketMap[senderId.toString()];
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageStatusUpdate", { id: newMsg._id, status: newMsg.status });
            }
        }

        res.json({success: true, newMessage: newMsg});
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getNonFriends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    // get the logged-in user for finding friends
    const currentUser = await User.findById(userId).select("friends");
    if (!currentUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // users who are neither me nor in my friends list
    const nonFriends = await User.find({
      _id: { $ne: userId, $nin: currentUser.friends },
    }).select("-password")
      .sort({ fullName: 1 });

    res.json({ success: true, users: nonFriends });
  } catch (error) {
    console.error("Error in getNonFriends:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};