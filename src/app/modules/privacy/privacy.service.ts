import { TPrivacy } from "./privacy.interface";
import { PrivacyModel } from "./privacy.model";

const createPrivacy = async (payload: TPrivacy) => {
  const result = await PrivacyModel.create(payload);
  return result;
};

const getPrivacy = async () => {
  const result = await PrivacyModel.findOne({});
  return result;
};

const updatePrivacy = async (_id: string, payload: TPrivacy) => {
  const result = await PrivacyModel.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return result;
};

export const privacyServices = {
  createPrivacy,
  getPrivacy,
  updatePrivacy
};