import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import supportMessageControllers from "./support.controller";
import supportMessageValidationSchema from "./support.validation";

const supportMessageRouters = Router();

supportMessageRouters.post("/", handleZodValidation(supportMessageValidationSchema), supportMessageControllers.sendSupportMessage);
supportMessageRouters.get("/", authVerify(["admin"]), supportMessageControllers.geTSupportMessageMessages);
supportMessageRouters.get("/:id", authVerify(["admin", "user"]), supportMessageControllers.getSingleSupportMessage);

export default supportMessageRouters;