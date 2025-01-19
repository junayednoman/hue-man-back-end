import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import postControllers from "./post.controller";
import { multerUploader } from "../../utils/multerS3Uploader";
const postRouters = Router();

postRouters.post(
  "/",
  authVerify(["user"]),
  multerUploader.uploadMultiple,
  postControllers.createPost
);

postRouters.get("/", postControllers.getAllPosts);

postRouters.put("/", authVerify(["user"]), postControllers.addNotInterested);

export default postRouters;
