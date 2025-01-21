import { ObjectId } from 'mongoose';

export interface ISubscription {
  auth: ObjectId;
  package_name: 'monthly' | 'yearly';
  stripe_subscription_id: string;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'canceled' | 'expired';
  remaining_messages: number;
}

export interface IPayment {
  user: ObjectId;
  transaction_id: string;
  amount: number;
  payment_date: Date;
  payment_status: 'paid' | 'failed' | 'pending';
  stripe_invoice_id: string;
  currency: string;
}
