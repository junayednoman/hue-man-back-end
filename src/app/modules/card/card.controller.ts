import { AppError } from "../../classes/appError";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { TCard } from "./card.interface";
import cardServices from "./card.service";
import { CardUpdateValidationSchema, CardValidationSchema } from "./card.validation";

const createCard = handleAsyncRequest(async (req, res) => {
  // Handle uploaded file (if any)
  const files = req?.files as any;

  const imageName = files?.image[0]?.filename;
  let audio = "";
  if (files?.audio) {
    const audioName = files?.audio[0]?.filename;
    audio = `uploads/audio/${audioName}`;
  }
  if (!imageName) throw new AppError(400, "Please provide an image file");

  const image = `${imageName}`;

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

const createCards = handleAsyncRequest(async (req, res) => {
  const payload = req.body?.cards;
  const result = await cardServices.createCards(payload);
  successResponse(res, {
    message: "Cards created successfully!",
    data: result,
    status: 201,
  });
});

const getAllCards = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const result = await cardServices.getAllCards(query);
  successResponse(res, {
    message: "Cards retrieved successfully!",
    data: result,
  });
});

const getSingleCard = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const userId = req.user.id
  const result = await cardServices.getSingleCard(id, userId);
  successResponse(res, {
    message: "Card retrieved successfully!",
    data: result,
  });
});

const updateCard = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const files = req?.files as any;

  const textData = JSON.parse(req?.body?.data || "{}");
  const payload: TCard = {
    ...textData,
  };

  if (files?.image) {
    const imageName = files?.image[0]?.filename;
    if (imageName) payload.image = imageName;
  }


  if (files?.audio) {
    const audioName = files?.audio[0]?.filename;
    payload.audio = `uploads/audio/${audioName}`;
  }

  handleZodValidation(CardUpdateValidationSchema);

  const result = await cardServices.updateCard(id, payload);
  successResponse(res, {
    message: "Card updated successfully!",
    data: result,
  });
});

const deleteCard = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const result = await cardServices.deleteCard(id);
  successResponse(res, {
    message: "Card deleted successfully!",
    data: result,
  });
});

const cardControllers = {
  createCard,
  createCards,
  getAllCards,
  getSingleCard,
  updateCard,
  deleteCard
};

export default cardControllers;
