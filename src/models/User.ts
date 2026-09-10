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
  isVerified?: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
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
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },
  },
  { timestamps: true },
);

// TTL index: Automatically deletes unverified accounts once verification token expires (24h)
UserSchema.index(
  { verificationTokenExpires: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { isVerified: false },
  },
);

// Fast sparse lookups for authentication tokens
UserSchema.index({ verificationToken: 1 }, { sparse: true });
UserSchema.index({ resetPasswordToken: 1 }, { sparse: true });

if (mongoose.models.User && !mongoose.models.User.schema.path("isVerified")) {
  delete (mongoose.models as Record<string, unknown>).User;
}

const UserModel: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default UserModel;
