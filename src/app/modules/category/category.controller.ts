import { AppError } from "../../classes/appError";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { TCategory } from "./category.interface";
import categoryServices from "./category.service";
import {
  categoryCreateValidationSchema,
  updateCategoryValidationSchema,
} from "./category.validation";

const createCategory = handleAsyncRequest(async (req, res) => {
  // Handle uploaded file (if any)
  const imageFile = req.file;
  if (!imageFile) {
    throw new AppError(400, "Please provide an image file");
  }

  const image = `uploads/images/${imageFile.filename}`;
  const textData = JSON.parse(req?.body?.data);
  const payload = {
    image,
    name: textData.name,
  };

  handleZodValidation(categoryCreateValidationSchema);

  const result = await categoryServices.createCategory(payload);
  successResponse(res, {
    message: "Category created successfully!",
    data: result,
    status: 201,
  });
});

const createManyCategories = handleAsyncRequest(async (req, res) => {
  const payload: TCategory[] = req.body.categories;
  const result = await categoryServices.createManyCategories(payload);
  successResponse(res, {
    message: "Categories created successfully!",
    data: result,
    status: 201,
  });
});

const getAllCategories = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const result = await categoryServices.getAllCategories(query);
  successResponse(res, {
    message: "Categories retrieved successfully!",
    data: result,
  });
});

const getSingleCategory = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const result = await categoryServices.getSingleCategory(id);
  successResponse(res, {
    message: "Categories retrieved successfully!",
    data: result,
  });
});

const updateCategory = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;

  // Handle uploaded file (if any)
  const imageFile = req.file;

  const image = imageFile && `uploads/images/${imageFile?.filename}`;
  const textData = JSON.parse(req?.body?.data);
  const payload = {
    image,
    name: textData.name,
  };

  handleZodValidation(updateCategoryValidationSchema);

  const result = await categoryServices.updateCategory(id, payload);
  successResponse(res, {
    message: "Category updated successfully!",
    data: result,
  });
});

const deleteCategory = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;

  const result = await categoryServices.deleteCategory(id);
  successResponse(res, {
    message: "Category deleted successfully!",
    data: result,
  });
});

const categoryControllers = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  createManyCategories
};

export default categoryControllers;
