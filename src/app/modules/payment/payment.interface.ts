import { ObjectId } from "mongoose";

export interface TPayment {
  user: ObjectId;
  transaction_id: string;
  amount: number;
  payment_date: Date;
  payment_status: 'paid' | 'failed' | 'pending';
  currency: string;
}
