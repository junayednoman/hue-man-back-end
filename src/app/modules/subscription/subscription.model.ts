import { model, Schema } from "mongoose";
import { TSubscription } from "./subscription.interface";
import { packageKeys } from "../packages/packages.interface";

const subscriptionSchema = new Schema<TSubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  package_key: { type: String, enum: packageKeys, required: true },
  billing_interval: { type: String, enum: ['monthly', 'yearly'], required: true },
  price_paid: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'usd' },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: String, enum: ['active', 'canceled', 'expired'], default: 'active' },
  web: { type: Boolean, default: false },
}, {
  timestamps: true
})

subscriptionSchema.index({ user: 1, web: 1 });

const Subscription = model<TSubscription>('Subscription', subscriptionSchema);
export default Subscription;
