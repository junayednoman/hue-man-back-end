import { model, Schema } from "mongoose";
import { TPrint } from "./print.interface";

const printSchema = new Schema<TPrint>({
  user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  card: { type: String, required: true },
  print_count: { type: Number, default: 0 },
}, {
  timestamps: true
})

export const PrintModel = model<TPrint>("Print", printSchema);