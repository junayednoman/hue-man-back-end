import mongoose, { Schema } from 'mongoose';
import { TPackage } from './packages.interface';

const packageSchema = new Schema<TPackage>(
  {
    package_name: { type: String, enum: ['monthly', 'yearly'], required: true },
    price: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

const PackageModel = mongoose.model<TPackage>('Package', packageSchema);
export default PackageModel;
