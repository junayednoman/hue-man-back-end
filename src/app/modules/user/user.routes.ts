import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import userControllers from "./user.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { userProfileUpdateValidationSchema } from "./user.validation";

const userRouters = Router();

userRouters.get("/", authVerify(["admin"]), userControllers.getAllUsers);
userRouters.get(
  "/:id",
  authVerify(["admin", "user"]),
  userControllers.getSingleUser
);
userRouters.put(
  "/:id",
  authVerify(["admin", "user"]),
  handleZodValidation(userProfileUpdateValidationSchema),
  userControllers.updateUser
);
userRouters.delete(
  "/:id",
  authVerify(["admin", "user"]),
  userControllers.deleteUser
);

export default userRouters;
