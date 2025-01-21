import { Router } from "express";
import { termsControllers } from "./terms.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { termsValidationSchema } from "./terms.validation";

const termsRoutes = Router();

termsRoutes.post("/", handleZodValidation(termsValidationSchema), termsControllers.createTerms);
termsRoutes.get("/", termsControllers.getTerms);
termsRoutes.put("/:id", handleZodValidation(termsValidationSchema), termsControllers.updateTerms);

export default termsRoutes;