import { ObjectId } from "mongoose";
import { AppError } from "../../classes/appError";
import CardModel from "../card/card.model";
import { TVoice } from "./customVoice.interface";
import CustomVoice from "./customVoice.model";
import { deleteFile } from "../../utils/deleteFile";

const addVoice = async (userId: string, payload: TVoice) => {
  const card = await CardModel.findById(payload.card);
  if (!card) throw new AppError(404, "Invalid card ID");

  payload.user = userId as unknown as ObjectId;
  const voice = await CustomVoice.findOneAndUpdate({ user: userId, card: payload.card }, payload, { upsert: true, new: true });
  return voice;
}

const getVoice = async (userId: string, cardId: string) => {
  const voice = await CustomVoice.findOne({ user: userId, card: cardId });
  return voice;
}

const deleteVoice = async (id: string) => {
  const voice = await CustomVoice.findById(id);
  if (!voice) throw new AppError(404, "Invalid voice ID");
  const result = await CustomVoice.findByIdAndDelete(id);
  await deleteFile(voice.voice);
  return result;
}

const customVoiceServices = { addVoice, getVoice, deleteVoice };

export default customVoiceServices;