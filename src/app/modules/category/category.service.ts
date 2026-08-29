import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import { deleteFile } from "../../utils/deleteFile";
import { TCategory } from "./category.interface";
import CategoryModel from "./category.model";

const createCategory = async (payload: TCategory) => {
  const category = await CategoryModel.findOne({ name: payload.name });
  if (category) {
    // delete the newly uploaded image if category already exists
    await deleteFile(payload.image);
    throw new AppError(400, "Category already exists");
  }
  console.log("payload", payload);
  const result = await CategoryModel.create(payload);
  return result;
};

const createManyCategories = async (payload: TCategory[]) => {
  const cateNames = payload.map((cat) => cat.name);
  const categories = await CategoryModel.find({ name: { $in: cateNames } });
  if (categories && categories.length > 0) {
    const existingCategoryNames = categories.map((cat) => cat.name);
    const newCategories = payload.filter(
      (cat) => !existingCategoryNames.includes(cat.name),
    );
    const result = await CategoryModel.insertMany(newCategories);
    const existingMessage =
      categories.length == 1
        ? `A category already exists with the name: ${categories[0].name}`
        : "Following categories already exist: " +
          existingCategoryNames.join(", ");
    return { data: result, message: existingMessage };
  }

  const result = await CategoryModel.insertMany(payload);
  return result;
};

const getAllCategories = async (query: Record<string, any>) => {
  const searchableFields = ["name"];
  query.limit = 100000;
  const categoryQuery = new QueryBuilder(
    CategoryModel.find({ parent: null }),
    query,
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

const getNestedCategories = async (query: Record<string, any>) => {
  const categoryQuery = new QueryBuilder(
    CategoryModel.find({ parent: null, is_deleted: false }),
    { ...query, limit: 100000 },
  )
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await categoryQuery.countTotal();
  const mainCategories = await categoryQuery.queryModel.lean();
  const mainCategoryIds = mainCategories.map((category) => category._id);

  const childCategories = await CategoryModel.find({
    is_deleted: false,
    _id: { $nin: mainCategoryIds },
  })
    .sort({ index: 1, createdAt: -1 })
    .lean();

  const childrenByParent = new Map<string, any[]>();
  for (const category of childCategories) {
    const parentId = String(category.parent);
    const children = childrenByParent.get(parentId) || [];
    children.push(category);
    childrenByParent.set(parentId, children);
  }

  const addNestedChildren = (category: any): any => ({
    ...category,
    sub_categories: (childrenByParent.get(String(category._id)) || []).map(
      addNestedChildren,
    ),
  });

  return {
    data: mainCategories.map(addNestedChildren),
    meta,
  };
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
    index?: number;
  },
) => {
  const category = await CategoryModel.findOne({ _id, is_deleted: false });
  if (!category) {
    if (payload.image) {
      await deleteFile(payload.image);
    }
    throw new AppError(404, "Category not found");
  }
  const result = await CategoryModel.findOneAndUpdate({ _id }, payload, {
    new: true,
  });

  // delete old image from
  if (result && payload.image) {
    await deleteFile(category.image);
  }
  return result;
};

const deleteCategory = async (_id: string) => {
  const category = await CategoryModel.findById(_id);
  if (!category) throw new AppError(404, "Category not found");

  const result = await CategoryModel.findOneAndDelete({ _id });

  if (result) {
    await deleteFile(category.image);
  }

  return result;
};

const categoryServices = {
  createCategory,
  getAllCategories,
  getNestedCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  createManyCategories,
};
export default categoryServices;
