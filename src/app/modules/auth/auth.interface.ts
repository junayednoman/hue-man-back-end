import { ObjectId } from "mongoose";

export type TAuth = {
  email: string;
  password: string;
  user: ObjectId;
  role: "user" | "admin";
  is_account_verified: boolean;
  otp?: string;
  otp_expires?: Date;
  otp_attempts: number;
  is_otp_verified: boolean;
  is_deleted: boolean;
  is_blocked: boolean;
};
