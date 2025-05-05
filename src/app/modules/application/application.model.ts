import mongoose, { Schema } from "mongoose";
import { TApplication } from "./application.interface";

const ApplicationSchema = new Schema<TApplication>(
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
    email_address: {
      type: String,
      required: true
    },
    about_yourself: {
      type: String,
      required: true,
    },
    promotion_methods: {
      social_media: { type: Boolean, default: false },
      blogs_or_newsletters: { type: Boolean, default: false },
      professional_events: { type: Boolean, default: false },
      other: { type: String, default: '' },
    },
    payout_method: {
      type: String,
      enum: ['PayPal', 'Bank Transfer'],
      required: true,
    },
    currently_using_hue_man: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = mongoose.model<TApplication>('Application', ApplicationSchema);

export default ApplicationModel;