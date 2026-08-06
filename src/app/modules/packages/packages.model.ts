import mongoose, { Schema } from 'mongoose';
import { packageKeys, TPackage } from './packages.interface';

const packageSchema = new Schema<TPackage>(
  {
    key: { type: String, enum: packageKeys, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    monthly_price: { type: Number, required: true, min: 0 },
    yearly_price: { type: Number, required: true, min: 0 },
    sub_user_limit: { type: Number, required: true, min: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const PackageModel = mongoose.model<TPackage>('Package', packageSchema);
export default PackageModel;
