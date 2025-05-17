import { ObjectId } from "mongoose";

export type TPrint = {
  user: ObjectId;
  card: string;
  print_count: number;
}