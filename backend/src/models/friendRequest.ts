import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFriendRequest extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt?: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);
export default FriendRequest;
