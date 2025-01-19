import mongoose, { Schema } from "mongoose";
import { TUserProfile } from "./user.interface";
import {
  defaultCoverImg,
  defaultProfileImg,
} from "../../constants/global.constant";

const userSchema = new Schema<TUserProfile>(
  {
    profile_image: { type: String, default: defaultProfileImg },
    cover_image: { type: String, default: defaultCoverImg },
    name: { type: String, default: null },
    location: { type: String, default: null },
    gender: { type: String, enum: ["male", "female", "other"], default: null },
    age: { type: Number, default: null },
    category: { type: String, trim: true, default: null },
    pet_info: { type: String, trim: true, default: null },

    owner_name: { type: String, trim: true, default: null },
    owner_profile_picture: { type: String },
    user_type: {
      type: String,
      enum: ["subscriber", "unsubscriber"],
      default: "unsubscriber",
    },
    owner_relationship: {
      type: String,
      enum: ["single", "married", "divorced", "widowed", "other"],
      default: null,
    },
    owner_gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    owner_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    is_deleted: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<TUserProfile>("User", userSchema);
export default UserModel;
