import { Router } from "express";
import categoryControllers from "./category.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { createManyCategoriesValidationSchema } from "./category.validation";
import { uploadSingleImage } from "../../utils/multerFIleUploader";
const categoryRouters = Router();

categoryRouters.post(
  "/",
  uploadSingleImage,
  categoryControllers.createCategory
);

categoryRouters.post(
  "/many",
  handleZodValidation(createManyCategoriesValidationSchema),
  categoryControllers.createManyCategories
);

categoryRouters.get("/", categoryControllers.getAllCategories);

categoryRouters.get(
  "/:id",
  categoryControllers.getSingleCategory
);

categoryRouters.put(
  "/:id",
  uploadSingleImage,
  categoryControllers.updateCategory
);

categoryRouters.delete(
  "/:id",
  categoryControllers.deleteCategory
);

export default categoryRouters;
