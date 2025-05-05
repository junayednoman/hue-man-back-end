import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { applicationControllers } from "./application.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import ApplicationValidationSchema from "./application.validation";

const applicationRouters = Router();

applicationRouters.post("/", authVerify(["user"]), handleZodValidation(ApplicationValidationSchema), applicationControllers.createApplication);
applicationRouters.get("/", authVerify(["admin"]), applicationControllers.getApplications);
applicationRouters.get("/:id", authVerify(["admin", "user"]), applicationControllers.getApplication);

export default applicationRouters;