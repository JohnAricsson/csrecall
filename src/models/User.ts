import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  completedChapters: string[];
  completedTopics: string[];
  defusedTraps: string[];
  masteredFlashcards: string[];
  xp: number;
  streak: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    avatarUrl: { type: String },
    completedChapters: [{ type: String }],
    completedTopics: [{ type: String }],
    defusedTraps: [{ type: String }],
    masteredFlashcards: [{ type: String }],
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

const UserModel: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default UserModel;
