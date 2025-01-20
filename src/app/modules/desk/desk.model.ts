import { model, Schema } from "mongoose";
import { TDesk } from "./desk.interface";

const deskSchema = new Schema<TDesk>({
  card: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Card',
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Auth',
  },
  index: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const DeskModel = model<TDesk>("DeskCard", deskSchema);