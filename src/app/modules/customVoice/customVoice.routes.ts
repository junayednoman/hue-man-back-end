import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import customVoiceControllers from "./customVoice.controller";
import { uploadSingleAudio } from "../../utils/multerFIleUploader";

const customVoiceRouters = Router();

customVoiceRouters.post("/", authVerify(["user"]), uploadSingleAudio, customVoiceControllers.addVoice);
customVoiceRouters.get("/:cardId", authVerify(["user"]), customVoiceControllers.getVoice);
customVoiceRouters.delete("/:cardId", authVerify(["user"]), customVoiceControllers.deleteVoice);

export default customVoiceRouters;