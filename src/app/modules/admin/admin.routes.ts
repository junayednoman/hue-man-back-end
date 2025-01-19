import { Router } from "express";
import adminControllers from "./admin.controller";
import authVerify from "../../middlewares/authVerify";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import updateAdminValidationSchema from "./admin.validation";
const adminRouters = Router();

adminRouters.get("/:id", authVerify(["admin"]), adminControllers.getAdminById);
adminRouters.put(
  "/:id",
  authVerify(["admin"]),
  handleZodValidation(updateAdminValidationSchema),
  adminControllers.updateAdmin
);
export default adminRouters;
