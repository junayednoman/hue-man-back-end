import { Router } from "express";
import { privacyControllers } from "./privacy.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { privacyValidationSchema } from "./privacy.validation";

const privacyRoutes = Router();

privacyRoutes.post("/", handleZodValidation(privacyValidationSchema), privacyControllers.createPrivacy);
privacyRoutes.get("/", privacyControllers.getPrivacy);
privacyRoutes.put("/:id", handleZodValidation(privacyValidationSchema), privacyControllers.updatePrivacy);

export default privacyRoutes;