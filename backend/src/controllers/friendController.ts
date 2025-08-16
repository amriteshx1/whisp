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
      res.status(400).json({ message: "Can't send a request to yourself" });
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
      res.status(404).json({ message: "User not found" });
      return;
    }

    //check if already friends
    if (targetUser.friends.includes(senderId)) {
      res.status(400).json({ message: "User is already your friend" });
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
      res.status(400).json({ message: "Friend request already pending" });
      return;
    }

    //create new friend request
    const newRequest = new FriendRequest({
      senderId,
      receiverId: targetUser._id,
      status: "pending"
    });
    await newRequest.save();

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// accept or reject friend request
export const respondToFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, action } = req.body; 
    const userId = req.user!._id;

    //find request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      res.status(404).json({ message: "Friend request not found" });
      return;
    }

    //ensuring this user is the receiver
    if (String(friendRequest.receiverId) !== String(userId)) {
      res.status(403).json({ message: "Not authorized to respond to this request" });
      return;
    }

    if (friendRequest.status !== "pending") {
      res.status(400).json({ message: "Request already processed" });
      return;
    }

    if (action === "accept") {
      // update both users' friends list
      await User.findByIdAndUpdate(friendRequest.senderId, {
        $addToSet: { friends: friendRequest.receiverId }
      });

      await User.findByIdAndUpdate(friendRequest.receiverId, {
        $addToSet: { friends: friendRequest.senderId }
      });

      friendRequest.status = "accepted";
      await friendRequest.save();

      res.json({ message: "Friend request accepted" });
      return;
    }

    if (action === "reject") {
      friendRequest.status = "rejected";
      await friendRequest.save();
      res.json({ message: "Friend request rejected" });
      return;
    }

    res.status(400).json({ message: "invalid action" });
    return;
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).json({ message: "server error" });
  }
};

//view pending requests
export const getPendingFriendRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    //you are receiver
    const incoming = await FriendRequest.find({
      receiverId: userId,
      status: "pending",
    }).populate("senderId", "fullName profilePic friendCode");

    //you are sender
    const outgoing = await FriendRequest.find({
      senderId: userId,
      status: "pending",
    }).populate("receiverId", "fullName profilePic friendCode");

    res.json({ incoming, outgoing });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//delete friend
export const deleteFriend = async (req: AuthRequest, res: Response) => {
  try {
    const { friendId } = req.params;
    const userId = req.user!._id;

    //check if target user exists
    const targetUser = await User.findById(friendId);
    if (!targetUser) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }

    //remove each other from friends list
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId }
    });

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error deleting friend:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get list of friends
export const getFriendsList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const user = await User.findById(userId)
      .populate("friends", "fullName profilePic friendCode");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ friends: user.friends });
  } catch (error) {
    console.error("error fetching friends list:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// search user by friend code
export const searchByFriendCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      res.status(400).json({ message: "Friend code is required" });
      return;
    }

    const user = await User.findOne({ friendCode: code.toUpperCase() }).select(
      "fullName profilePic friendCode"
    );

    if (!user) {
      res.status(404).json({ message: "No user found with this code" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("error searching by friend code:", error);
    res.status(500).json({ message: "Server error" });
  }
};
