import mongoose, { Schema, model } from "mongoose";
import { TCard } from "./card.interface";

const CardSchema: Schema = new Schema<TCard>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CardModel = model<TCard>("Card", CardSchema);

export default CardModel;
