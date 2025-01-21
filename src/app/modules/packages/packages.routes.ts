import { Router } from "express";
import packageController from "./packages.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { PackageValidationSchema } from "./packages.validation";

export const packagesRoutes = Router();
packagesRoutes.get('/', packageController.getAllPackages)
packagesRoutes.get('/:id', packageController.getSinglePackage)
packagesRoutes.put('/:id', handleZodValidation(PackageValidationSchema), packageController.updatePackage)