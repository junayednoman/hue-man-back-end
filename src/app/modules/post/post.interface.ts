import { ObjectId } from "mongoose";

export type TPost = {
  location: string;
  category: ObjectId;
  images?: string[];
  caption?: string;
  author: ObjectId;
  is_deleted?: boolean;
  is_blocked?: boolean;
  not_interests?: ObjectId[];
};
