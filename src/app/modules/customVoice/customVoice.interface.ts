import { ObjectId } from "mongoose";

export type TVoice = {
  user: ObjectId;
  card: ObjectId;
  voice: string;
}