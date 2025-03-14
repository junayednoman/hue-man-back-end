import { Router } from "express";
import cardControllers from "./card.controller";
import { uploadImageAndAudio } from "../../utils/multerFIleUploader";
const cardRouters = Router();

cardRouters.post(
  "/",
  uploadImageAndAudio,
  cardControllers.createCard
);

cardRouters.post(
  "/many",
  cardControllers.createCards
);

cardRouters.get("/", cardControllers.getAllCards);


export default cardRouters;
