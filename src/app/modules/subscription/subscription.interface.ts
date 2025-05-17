import { ObjectId } from 'mongoose';

export type TSubscription = {
  user: ObjectId;
  package_name: ObjectId;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'canceled' | 'expired';
  web: boolean;
};