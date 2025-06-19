import { ObjectId } from "mongoose";

export type TCategory = {
  name: string;
  image: string;
  parent?: ObjectId;
  is_deleted?: boolean;
};
