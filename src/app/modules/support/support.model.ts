import { model, Schema } from "mongoose";
import { TSupportMessage } from "./support.interface";

const supportMessageSchema = new Schema<TSupportMessage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SupportMessageModel = model<TSupportMessage>('SupportMessage', supportMessageSchema);

export default SupportMessageModel;