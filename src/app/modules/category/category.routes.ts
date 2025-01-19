import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import categoryControllers from "./category.controller";
import { multerUploader } from "../../utils/multerS3Uploader";
const categoryRouters = Router();

categoryRouters.post(
  "/",
  authVerify(["admin"]),
  multerUploader.uploadSingle,
  categoryControllers.createCategory
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
