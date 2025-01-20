import { ObjectId } from "mongoose"

export type TDesk = {
  card: ObjectId;
  user: ObjectId;
  index: number;
}