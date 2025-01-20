import { AppError } from "../../classes/appError";
import AuthModel from "../auth/auth.model";
import CardModel from "../card/card.model";
import { TDesk } from "./desk.interface";
import { DeskModel } from "./desk.model";

const addToDesk = async (payload: TDesk) => {
  const user = await AuthModel.findOne({ _id: payload.user, is_deleted: false });
  if (!user) throw new AppError(404, "User not found");
  const card = await CardModel.findById(payload.card)
  if (!card) throw new AppError(404, "Card not found");
  const deskCard = await DeskModel.findOne({ user: payload.user, card: payload.card });
  if (deskCard) throw new AppError(400, "Card already added to desk");
  const result = await DeskModel.create(payload);
  return result;
};

const getAllDeskCards = async (userId: string) => {
  const cards = await DeskModel.find({ user: userId })
    .sort({ index: 1 })
    .populate("card", "name image")
    .populate("user", "email role");
  return cards;
}

const removeFromDesk = async (id: string, userId: string) => {
  const card = await DeskModel.findById(id);
  if (!card) throw new AppError(404, "Card not found");
  if (userId !== card.user.toString()) throw new AppError(403, "Forbidden");
  await card.deleteOne();
  return card;
};

const changeIndex = async (id: string, index: number, userId: string) => {
  const card = await DeskModel.findById(id);
  if (!card) throw new AppError(404, "Card not found");
  if (userId !== card.user.toString()) throw new AppError(403, "Forbidden");
  card.updateOne({ index: index }, { new: true });
}

export const deskServices = {
  addToDesk,
  removeFromDesk,
  getAllDeskCards,
  changeIndex
};