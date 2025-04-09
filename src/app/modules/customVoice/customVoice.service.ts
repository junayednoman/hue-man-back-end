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

  const voice = await CustomVoice.findOne({ user: userId, card: payload.card });
  if (voice) {
    await deleteFile(voice.voice);
    const result = await CustomVoice.findByIdAndUpdate(voice._id, { voice: payload.voice }, { new: true });
    return result;
  } else {
    const result = await CustomVoice.create(payload);
    return result;
  }

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