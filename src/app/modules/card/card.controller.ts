import { AppError } from "../../classes/appError";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { TCard } from "./card.interface";
import cardServices from "./card.service";
import { CardValidationSchema } from "./card.validation";

const createCard = handleAsyncRequest(async (req, res) => {
  // Handle uploaded file (if any)
  const files = req.files as any;

  const imageName = files.image[0].filename;
  const audioName = files.audio[0].filename;
  if (!imageName) throw new AppError(400, "Please provide an image file");
  if (!audioName) throw new AppError(400, "Please provide an audio file");

  const image = `uploads/images/${imageName}`;
  const audio = `uploads/audio/${audioName}`;

  const textData = JSON.parse(req?.body?.data);

  const payload: TCard = {
    image,
    audio,
    ...textData,
  };

  handleZodValidation(CardValidationSchema);

  const result = await cardServices.createCard(payload);
  successResponse(res, {
    message: "Card created successfully!",
    data: result,
    status: 201,
  });
});

const getAllCards = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const currentUser = req?.body?.currentUser;
  const result = await cardServices.getAllCards(query, currentUser);
  successResponse(res, {
    message: "Cards retrieved successfully!",
    data: result,
  });
});

const addNotInterested = handleAsyncRequest(async (req, res) => {
  const card = req?.body?.cardId;
  const user = req?.body?.userId;
  const result = await cardServices.addNotInterested(card, user);
  successResponse(res, {
    message: "User added to not interested list successfully!",
    data: result,
  });
});

const cardControllers = {
  createCard,
  getAllCards,
  addNotInterested,
};

export default cardControllers;
