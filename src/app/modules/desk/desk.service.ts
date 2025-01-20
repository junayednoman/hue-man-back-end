import { AppError } from "../../classes/appError";
import AuthModel from "../auth/auth.model";
import CardModel from "../card/card.model";
import { TDesk } from "./desk.interface";

const addToDesk = async (payload: TDesk) => {
  const user = await AuthModel.findOne({ _id: payload.user, is_deleted: false });
  if (!user) throw new AppError(404, "User not found");
  const card = await CardModel.findById(payload.card)
  if (!card) throw new AppError(404, "Card not found");

  const result = await CardModel.create(payload);
  return result;
};

export const deskServices = {
  addToDesk,
};