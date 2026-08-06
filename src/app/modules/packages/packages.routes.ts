import { Router } from "express";
import packageController from "./packages.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { PackageValidationSchema } from "./packages.validation";
import authVerify from "../../middlewares/authVerify";

export const packagesRoutes = Router();
packagesRoutes.get('/', packageController.getAllPackages)
packagesRoutes.get('/:id', packageController.getSinglePackage)
packagesRoutes.post('/', authVerify(["admin"]), handleZodValidation(PackageValidationSchema), packageController.createPackage)
packagesRoutes.put('/:id', authVerify(["admin"]), handleZodValidation(PackageValidationSchema), packageController.updatePackage)
