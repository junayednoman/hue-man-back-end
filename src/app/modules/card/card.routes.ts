import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import cardControllers from "./card.controller";
import { uploadImageAndAudio } from "../../utils/multerFIleUploader";
const cardRouters = Router();

cardRouters.post(
  "/",
  authVerify(["admin"]),
  uploadImageAndAudio,
  cardControllers.createCard
);

cardRouters.post(
  "/many",
  authVerify(["admin"]),
  cardControllers.createCards
);

cardRouters.get("/", cardControllers.getAllCards);

cardRouters.post("/", authVerify(["user"]), cardControllers.addNotInterested);

export default cardRouters;
