import { ObjectId } from "mongoose";

export interface TApplication {
  user: ObjectId;
  full_name: string;
  email_address: string;
  about_yourself: string;
  promotion_methods: {
    social_media: boolean;
    blogs_or_newsletters: boolean;
    professional_events: boolean;
    other: string;
  };
  payout_method: 'PayPal' | 'Bank Transfer';
  currently_using_hue_man: boolean;
}
