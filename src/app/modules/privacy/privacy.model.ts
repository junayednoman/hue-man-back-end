import { model, Schema } from "mongoose";
import { TPrivacy } from "./privacy.interface";

const privacySchema = new Schema<TPrivacy>({
  text: { type: String, required: true },
});

export const PrivacyModel = model<TPrivacy>("Privacy", privacySchema);