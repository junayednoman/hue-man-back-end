import { Router } from "express";
import cardControllers from "./card.controller";
import { upload, uploadImageAndAudio } from "../../utils/multerFIleUploader";
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

cardRouters.put("/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]), cardControllers.updateCard);


cardRouters.delete("/:id", cardControllers.deleteCard);

export default cardRouters;
