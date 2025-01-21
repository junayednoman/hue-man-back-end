import { model, Schema } from "mongoose";
import { TTerms } from "./terms.interface";

const termsSchema = new Schema<TTerms>({
  text: { type: String, required: true },
});

export const TermsModel = model<TTerms>("Terms", termsSchema);