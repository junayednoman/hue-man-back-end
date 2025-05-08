import mongoose, { Schema } from 'mongoose';
import { TPackage } from './packages.interface';

const packageSchema = new Schema<TPackage>(
  {
    package_name: { type: String, required: true },
    price: { type: Number, required: true },
    text: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true },
);

const PackageModel = mongoose.model<TPackage>('Package', packageSchema);
export default PackageModel;
