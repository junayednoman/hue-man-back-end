import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import { deleteSingleImageFromS3 } from "../../utils/deletes3Image";
import { TCategory } from "./category.interface";
import CategoryModel from "./category.model";

const createCategory = async (payload: TCategory) => {
  const category = await CategoryModel.findOne({ name: payload.name });
  if (category) {
    const objectKey = payload.image.split(".com/")[1];
    // delete the newly uploaded image if category already exists
    deleteSingleImageFromS3(objectKey);
    throw new AppError(400, "Category already exists");
  }

  const result = await CategoryModel.create(payload);
  return result;
};

const createManyCategories = async (payload: TCategory[]) => {
  const cateNames = payload.map((cat) => cat.name);
  const categories = await CategoryModel.find({ name: { $in: cateNames } })
  if (categories && categories.length > 0) {
    const existingCategoryNames = categories.map((cat) => cat.name);
    // categories.forEach((category) => {
    //   const objectKey = category.image.split(".com/")[1];
    //   // delete the newly uploaded image if category already exists
    //   deleteSingleImageFromS3(objectKey);
    // });
    const newCategories = payload.filter((cat) => !existingCategoryNames.includes(cat.name));
    const result = await CategoryModel.insertMany(newCategories);
    const existingMessage = categories.length == 1 ? `A category already exists with the name: ${categories[0].name}` : "Following categories already exist: " + existingCategoryNames.join(", ")
    return { data: result, message: existingMessage };
  }

  const result = await CategoryModel.insertMany(payload);
  return result;
};

const getAllCategories = async (query: Record<string, any>) => {
  const searchableFields = [
    "name",
  ];
  const categoryQuery = new QueryBuilder(
    CategoryModel.find({
      is_deleted: false,
    }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await categoryQuery.countTotal();
  const result = await categoryQuery.queryModel;
  return { data: result, meta };
};

const getSingleCategory = async (_id: string) => {
  const result = await CategoryModel.findOne({ _id, is_deleted: false });
  if (!result) throw new AppError(404, "Category not found");
  return result;
};

const updateCategory = async (
  _id: string,
  payload: {
    name?: string;
    image?: string;
    status?: "active" | "inactive";
  }
) => {
  const category = await CategoryModel.findOne({ _id, is_deleted: false });
  if (!category) throw new AppError(404, "Category not found");

  const result = await CategoryModel.findOneAndUpdate({ _id }, payload, {
    new: true,
  });

  // delete old image from s3 bucket
  if (result && payload.image) {
    const objectKey = category.image.split(".com/")[1];
    deleteSingleImageFromS3(objectKey);
  }
  return result;
};

const deleteCategory = async (_id: string) => {
  const category = await CategoryModel.findById(_id);
  if (!category) throw new AppError(404, "Category not found");
  if (category.is_deleted) throw new AppError(400, "Category already deleted");

  const result = await CategoryModel.findOneAndUpdate(
    { _id },
    { is_deleted: true },
    { new: true }
  );

  // if (result) {
  //   const objectKey = category.image.split(".com/")[1];
  //   deleteImageFromS3(objectKey);
  // }

  return result;
};

const categoryServices = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  createManyCategories
};
export default categoryServices;
