import mongoose, { Schema } from "mongoose";
import { TPost } from "./post.interface";

const postSchema = new Schema<TPost>(
  {
    location: { type: String, trim: true, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: { type: [String], default: null },
    caption: { type: String, trim: true, default: null },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_deleted: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    not_interests: { type: [mongoose.Schema.Types.ObjectId], ref: "Auth" },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<TPost>("Post", postSchema);
export default PostModel;
