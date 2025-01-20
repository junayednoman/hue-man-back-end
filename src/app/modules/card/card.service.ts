import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import { deleteFile } from "../../utils/deleteFile";
import AuthModel from "../auth/auth.model";
import CategoryModel from "../category/category.model";
import { TCard } from "./card.interface";
import CardModel from "./card.model";

const createCard = async (payload: TCard) => {
  const category = await CategoryModel.findOne({
    _id: payload.category,
    is_deleted: false,
  });

  if (!category) {
    await deleteFile(payload.image);
    await deleteFile(payload.audio);
    throw new AppError(404, "Category not found!")
  };

  if (payload.author) {
    const author = await AuthModel.findOne({
      _id: payload.author,
      is_deleted: false,
    });

    if (!author) {
      await deleteFile(payload.image);
      await deleteFile(payload.audio);
      throw new AppError(404, "Author not found!")
    };
  }

  const result = await CardModel.create(payload);
  return result;
};

const createCards = async (payload: TCard[]) => {
  const result = await CardModel.insertMany(payload);
  return result;
}

const getAllCards = async (query: Record<string, any>) => {
  const searchableFields = ["name"];

  const cardQuery = new QueryBuilder(
    CardModel.find(),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await cardQuery.countTotal();
  const result = await cardQuery.queryModel;
  return { data: result, meta };
};

const cardServices = {
  createCard,
  getAllCards,
  createCards
};

export default cardServices;
