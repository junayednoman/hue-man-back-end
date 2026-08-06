import { ObjectId } from 'mongoose';
import { TBillingInterval, TPackageKey } from '../packages/packages.interface';

export type TSubscription = {
  user: ObjectId;
  package: ObjectId;
  package_key: TPackageKey;
  billing_interval: TBillingInterval;
  price_paid: number;
  currency: string;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'canceled' | 'expired';
  web: boolean;
};
