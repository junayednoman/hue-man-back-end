import { model, Schema, Types } from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new Schema<ISubscription>(
  {
    auth: { type: Types.ObjectId, ref: 'Auth', required: true },
    package_name: { type: String, enum: ['monthly', 'yearly'], required: true },
    stripe_subscription_id: { type: String, required: true },
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

export const SubscriptionModel = model<ISubscription>(
  'Subscription',
  subscriptionSchema,
);

const paymentSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transaction_id: { type: String, required: true },
    payment_date: { type: Date, required: true },
    payment_status: {
      type: String,
      enum: ['paid', 'failed', 'pending'],
      required: true,
    },
    stripe_invoice_id: { type: String, required: true },
    currency: { type: String, required: true, default: 'usd' },
  },
  { timestamps: true },
);

export const PaymentModel = model('Payment', paymentSchema);
