import mongoose, { Schema } from "mongoose";
import { TAuth } from "./auth.interface";

const userSchema = new Schema<TAuth>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    is_email_verified: { type: Boolean, default: undefined },
    otp: { type: String, trim: true },
    otp_expires: { type: Date },
    otp_attempts: { type: Number, default: undefined },
    is_otp_verified: { type: Boolean, default: undefined },
    is_deleted: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const AuthModel = mongoose.model<TAuth>("Auth", userSchema);
export default AuthModel;
