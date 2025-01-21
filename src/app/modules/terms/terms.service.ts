import { AppError } from "../../classes/appError";
import { TTerms } from "./terms.interface";
import { TermsModel } from "./terms.model";


const createTerms = async (payload: TTerms) => {
  const term = await TermsModel.findOne({});
  if (term) throw new AppError(400, "Terms already exists");
  const result = await TermsModel.create(payload);
  return result;
};

const getTerms = async () => {
  const result = await TermsModel.findOne({});
  return result;
};

const updateTerms = async (_id: string, payload: TTerms) => {
  const term = await TermsModel.findById(_id);
  if (!term) throw new AppError(404, "Terms not found");
  const result = await TermsModel.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return result;
};

export const TermsServices = {
  createTerms,
  getTerms,
  updateTerms
};