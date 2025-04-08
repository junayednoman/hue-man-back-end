import { AppError } from "../../classes/appError";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import customVoiceServices from "./customVoice.service";

const addVoice = handleAsyncRequest(async (req: any, res) => {
  const userId = req.user.id
  const file = req.file as any;

  const audioName = file.filename;
  if (!audioName) throw new AppError(400, "Please provide an audio file");

  const audio = `uploads/audio/${audioName}`;

  const textData = JSON.parse(req?.body?.data);

  const payload = {
    audio,
    ...textData,
  };

  const result = await customVoiceServices.addVoice(userId, payload);
  successResponse(res, {
    message: "Custom voice uploaded successfully!",
    data: result
  });
});

const getVoice = handleAsyncRequest(async (req: any, res) => {
  const userId = req.user.id;
  const cardId = req.params.cardId;
  const result = await customVoiceServices.getVoice(userId, cardId);
  successResponse(res, {
    message: "Voice retrieved successfully!",
    data: result
  });
});

const deleteVoice = handleAsyncRequest(async (req, res) => {
  const id = req.params.cardId;
  const result = await customVoiceServices.deleteVoice(id);
  successResponse(res, {
    message: "Voice deleted successfully!",
    data: result
  });
});

const customVoiceControllers = {
  addVoice,
  getVoice,
  deleteVoice
};

export default customVoiceControllers;