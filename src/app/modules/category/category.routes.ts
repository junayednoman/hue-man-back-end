import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import categoryControllers from "./category.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { createManyCategoriesValidationSchema } from "./category.validation";
import { uploadSingleImage } from "../../utils/multerFIleUploader";
const categoryRouters = Router();

categoryRouters.post(
  "/",
  authVerify(["admin"]),
  uploadSingleImage,
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
  uploadSingleImage,
  categoryControllers.updateCategory
);

categoryRouters.delete(
  "/:id",
  authVerify(["admin"]),
  categoryControllers.deleteCategory
);

export default categoryRouters;
