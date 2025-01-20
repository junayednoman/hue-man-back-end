import mongoose from "mongoose";
import { TUserProfile } from "./user.interface";
import {
  defaultProfileImg,
} from "../../constants/global.constant";

const userSchema = new mongoose.Schema({
  image: {
    type: String,
    default: defaultProfileImg,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    default: null,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: null,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model<TUserProfile>("User", userSchema);
export default UserModel;
