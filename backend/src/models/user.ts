import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  bio?: string;
  friends: Types.ObjectId[];
  friendCode: string; 
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    friendCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// helper function to generate a random 6-character alphanumeric code
function generateFriendCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// pre-save hook to set friendCode if not already set
userSchema.pre<IUser>("save", async function (next) {
  if (!this.friendCode) {
    let newCode;
    let exists = true;

    // ensuring the generated code is unique
    while (exists) {
      newCode = generateFriendCode();
      const existingUser = await mongoose.model<IUser>("User").findOne({ friendCode: newCode });
      if (!existingUser) {
        exists = false;
      }
    }

    this.friendCode = newCode!;
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;