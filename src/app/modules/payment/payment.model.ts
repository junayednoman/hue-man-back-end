import { model, Schema } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>({
  user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, required: true, unique: true },
  checkout_session_id: { type: String, unique: true, sparse: true },
  status: { type: String, required: true },
  currency: { type: String, required: true }
}, {
  timestamps: true
})

const Payment = model<TPayment>('Payment', paymentSchema);
export default Payment;
