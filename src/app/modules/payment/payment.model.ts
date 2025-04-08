import { model, Schema, Types } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
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
    currency: { type: String, required: true, default: 'usd' },
  },
  { timestamps: true },
);

export const PaymentModel = model<TPayment>('Payment', paymentSchema);
