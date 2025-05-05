import { ObjectId } from "mongoose";

export interface TSupportMessage {
  user: ObjectId;
  full_name: string;
  email: string;
  subject: string;
  message: string;
}
