import { model, Schema, Types } from 'mongoose';
import { TSubscription } from './subscription.interface';

const subscriptionSchema = new Schema<TSubscription>(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    package_name: { type: String, enum: ['monthly', 'yearly'], required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired'],
      required: true,
      default: 'active',
    },
  },
  { timestamps: true },
);

export const SubscriptionModel = model<TSubscription>(
  'Subscription',
  subscriptionSchema,
);