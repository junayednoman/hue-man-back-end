import { model, Schema } from "mongoose";
import { TSubscription } from "./subscription.interface";

const subscriptionSchema = new Schema<TSubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  package_name: { type: String, required: false },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: String, enum: ['active', 'canceled', 'expired'], default: 'active' },
  web: { type: Boolean, default: false },
}, {
  timestamps: true
})

const Subscription = model<TSubscription>('Subscription', subscriptionSchema);
export default Subscription;