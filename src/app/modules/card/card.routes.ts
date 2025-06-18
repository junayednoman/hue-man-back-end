import { Router } from "express";
import cardControllers from "./card.controller";
import { uploadImageAndAudio } from "../../utils/multerFIleUploader";
import authVerify from "../../middlewares/authVerify";
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
cardRouters.get("/:id", authVerify(["user"]), cardControllers.getSingleCard);

export default cardRouters;