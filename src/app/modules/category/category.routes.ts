import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import categoryControllers from "./category.controller";
import { multerUploader } from "../../utils/multerS3Uploader";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { createManyCategoriesValidationSchema } from "./category.validation";
const categoryRouters = Router();

categoryRouters.post(
  "/",
  authVerify(["admin"]),
  multerUploader.uploadSingle,
  categoryControllers.createCategory
);

categoryRouters.post(
  "/many",
  authVerify(["admin"]),
  handleZodValidation(createManyCategoriesValidationSchema),
  categoryControllers.createManyCategories
);

categoryRouters.get("/", categoryControllers.getAllCategories);

categoryRouters.get(
  "/:id",
  authVerify(["admin"]),
  categoryControllers.getSingleCategory
);

categoryRouters.put(
  "/:id",
  authVerify(["admin"]),
  multerUploader.uploadSingle,
  categoryControllers.updateCategory
);

categoryRouters.delete(
  "/:id",
  authVerify(["admin"]),
  categoryControllers.deleteCategory
);

export default categoryRouters;
