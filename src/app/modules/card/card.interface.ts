import { ObjectId } from "mongoose";

export type TCard = {
  author: ObjectId;
  category: ObjectId;
  name: string;
  image: string;
  audio: string;
  index: number;
};
