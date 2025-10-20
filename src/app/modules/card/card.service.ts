import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import { deleteFile } from "../../utils/deleteFile";
import AuthModel from "../auth/auth.model";
import CategoryModel from "../category/category.model";
import CustomVoice from "../customVoice/customVoice.model";
import { TCard } from "./card.interface";
import CardModel from "./card.model";

const createCard = async (payload: TCard) => {
  const category = await CategoryModel.findOne({
    _id: payload.category,
    is_deleted: false,
  });

  if (!category) {
    await deleteFile(`uploads/images/${payload.image}`);
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

const getSingleCard = async (id: string, userId: string) => {
  const card = await CardModel.findById(id);
  const customVoice = await CustomVoice.findOne({ user: userId, card: id }).lean();
  if (card && customVoice) {
    const result = { ...card.toObject(), custom_voice: customVoice.voice };
    return result;
  }
  return card;
}

const updateCard = async (id: string, payload: TCard) => {
  const card = await CardModel.findById(id);
  if (!card) {
    await deleteFile(payload.image);
    await deleteFile(payload.audio);
    throw new AppError(404, "Card not found");
  }

  const result = await CardModel.findOneAndUpdate({ _id: id }, payload, { new: true, })
  if (result) {
    if (payload.image && card.image) {
      await deleteFile(`uploads/images/${card.image}`);
    }
    if (payload.audio && card.audio) {
      await deleteFile(card.audio);
    }
  }
  return result;
}

const updateCardIndex = async (id: string, newIndex: number) => {
  const session = await CardModel.startSession();
  session.startTransaction();

  try {
    const card = await CardModel.findById(id).session(session);
    if (!card) throw new AppError(404, "Invalid card ID 🤭");

    // no-op if index unchanged
    if (card.index === newIndex) {
      await session.endSession();
      return;
    }

    const category = card.category;

    // Step 1: Temporarily move any card already at newIndex
    const existingCard = await CardModel.findOne({
      category,
      index: newIndex,
    }).session(session);
    if (existingCard) {
      await CardModel.updateOne(
        { _id: existingCard._id },
        { $set: { index: -1 } },
        { session }
      );
    }

    // Step 2: Move the target card to new index
    const result = await CardModel.updateOne(
      { _id: id },
      { $set: { index: newIndex } },
      { session }
    );

    // Step 3: Move the temporarily shifted card to the old index
    if (existingCard) {
      await CardModel.updateOne(
        { _id: existingCard._id },
        { $set: { index: card.index } },
        { session }
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const deleteCard = async (id: string) => {
  const card = await CardModel.findById(id);
  if (!card) {
    throw new AppError(404, "Card not found");
  }

  const result = await CardModel.findByIdAndDelete(id);
  if (result) {
    if (card.image) {
      await deleteFile(`uploads/images/${card.image}`);
    }
    if (card.audio) {
      await deleteFile(card.audio);
    }
  }
  return result;
};

const cardServices = {
  createCard,
  getAllCards,
  createCards,
  getSingleCard,
  updateCard,
  updateCardIndex,
  deleteCard
};

export default cardServices;
