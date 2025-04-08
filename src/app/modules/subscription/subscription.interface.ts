import { ObjectId } from 'mongoose';

export interface TSubscription {
  user: ObjectId;
  package_name: 'monthly' | 'yearly';
  start_date: Date;
  end_date: Date;
  status: 'active' | 'canceled' | 'expired';
  remaining_messages: number;
}