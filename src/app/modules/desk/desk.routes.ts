import { Router } from "express";
import { deskControllers } from "./desk.controller";
import authVerify from "../../middlewares/authVerify";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { deskValidationSchema } from "./desk.validation";

const deskRoutes = Router();
deskRoutes.post("/", authVerify(["user"]), handleZodValidation(deskValidationSchema), deskControllers.addToDesk);
deskRoutes.get("/", authVerify(["user"]), deskControllers.getAllDeskCards);
deskRoutes.delete("/:id", authVerify(["user"]), deskControllers.removeFromDesk);
deskRoutes.patch("/:id", authVerify(["user"]), deskControllers.changeIndex);

export default deskRoutes;