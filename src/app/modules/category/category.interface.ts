import { ObjectId } from "mongoose";

export type TCategory = {
  name: string;
  image: string;
  parent?: ObjectId;
  index: number;
  is_deleted?: boolean;
};
