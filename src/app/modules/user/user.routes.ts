import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import userControllers from "./user.controller";
import { uploadSingleImage } from "../../utils/multerFIleUploader";

const userRouters = Router();

userRouters.get("/", authVerify(["admin"]), userControllers.getAllUsers);
userRouters.get("/profile", authVerify(["user"]), userControllers.getProfile);
userRouters.get(
  "/:id",
  authVerify(["admin", "user"]),
  userControllers.getSingleUser
);
userRouters.put(
  "/",
  authVerify(["admin", "user"]),
  uploadSingleImage,
  userControllers.updateUser
);
userRouters.delete(
  "/:id",
  authVerify(["admin", "user"]),
  userControllers.deleteUser
);

export default userRouters;
