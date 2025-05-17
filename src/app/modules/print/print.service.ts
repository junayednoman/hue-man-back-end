import { AppError } from "../../classes/appError";
import { printItems } from "../../constants/global.constant";
import AuthModel from "../auth/auth.model"
import { PrintModel } from "./print.model";

const createPrints = async (email: string) => {
  const user = await AuthModel.findOne({ email });
  if (!user) throw new AppError(401, "Unauthorized");
  const items = printItems.map(item => ({
    ...item,
    user: user._id
  }))
  const result = await PrintModel.create(items);
  return result;
}

const getPrints = async (id: string) => {
  const result = await PrintModel.find({ user: id });
  return result;
}

const increaseCount = async (id: string) => {
  const print = await PrintModel.findById(id);
  if (!print) throw new AppError(404, "Print not found");
  const result = await PrintModel.findByIdAndUpdate(id, { $inc: { print_count: 1 } }, { new: true });
  return result;
}

export const printServices = { createPrints, getPrints, increaseCount }