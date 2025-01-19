export type TAuth = {
  email: string;
  password: string;
  role: "user" | "admin";
  is_email_verified: boolean;
  otp?: string;
  otp_expires?: Date;
  otp_attempts: number;
  is_otp_verified: boolean;
  is_deleted: boolean;
  is_blocked: boolean;
};
