import mongoose, { Schema } from "mongoose";
import { TCategory } from "./category.interface";

const categorySchema = new Schema<TCategory>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    is_deleted: { type: Boolean, default: false },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    index: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model<TCategory>("Category", categorySchema);
export default CategoryModel;
