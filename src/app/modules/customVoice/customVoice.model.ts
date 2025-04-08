import mongoose, { Schema } from "mongoose";
import { TVoice } from "./customVoice.interface";

const voiceSchema: Schema = new Schema<TVoice>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    card: { type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true },
    voice: { type: String, required: true },
  },
  { timestamps: true } 
);

const CustomVoice = mongoose.model<TVoice>("Voice", voiceSchema);

export default CustomVoice;
