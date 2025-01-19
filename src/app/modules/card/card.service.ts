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

const getAllCards = async (query: Record<string, any>, currentUser: string) => {
  const searchableFields = ["location", "author.name", "currentUser"];
  const queryLogic: any = {
    is_deleted: false,
    is_blocked: false,
  };

  // Add the `not_interests` condition only if `currentUser` exists
  if (currentUser) {
    queryLogic.not_interests = { $nin: [currentUser] };
  }
  const cardQuery = new QueryBuilder(
    CardModel.find(queryLogic)
      .populate("author", "name profile_image")
      .populate("category", "name"),
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

const addNotInterested = async (cardId: string, userId: string) => {
  const card = await CardModel.findOne({ _id: cardId, is_deleted: false });
  if (!card) throw new AppError(404, "card not found");
  const user = await AuthModel.findOne({ _id: userId, is_deleted: false });
  if (!user) throw new AppError(404, "User not found");
  const result = await CardModel.findOneAndUpdate(
    { _id: cardId },
    { $addToSet: { not_interests: userId } },
    { new: true }
  );
  return result;
};

const cardServices = {
  createCard,
  getAllCards,
  addNotInterested,
  createCards
};

export default cardServices;
