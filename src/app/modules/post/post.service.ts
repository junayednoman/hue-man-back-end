import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import AuthModel from "../auth/auth.model";
import CategoryModel from "../category/category.model";
import UserModel from "../user/user.model";
import { TPost } from "./post.interface";
import PostModel from "./post.model";

const createPost = async (payload: TPost) => {
  const category = await CategoryModel.findOne({
    _id: payload.category,
    is_deleted: false,
  });
  if (!category) throw new AppError(404, "Category not found!");
  const author = await UserModel.findOne({
    _id: payload.author,
    is_deleted: false,
  });
  if (!author) throw new AppError(404, "User not found!");

  const result = await PostModel.create(payload);
  return result;
};

const getAllPosts = async (query: Record<string, any>, currentUser: string) => {
  const searchableFields = ["location", "author.name", "currentUser"];
  const queryLogic: any = {
    is_deleted: false,
    is_blocked: false,
  };

  // Add the `not_interests` condition only if `currentUser` exists
  if (currentUser) {
    queryLogic.not_interests = { $nin: [currentUser] };
  }
  const postQuery = new QueryBuilder(
    PostModel.find(queryLogic)
      .populate("author", "name profile_image")
      .populate("category", "name"),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.queryModel;
  return { data: result, meta };
};

const addNotInterested = async (postId: string, userId: string) => {
  const post = await PostModel.findOne({ _id: postId, is_deleted: false });
  if (!post) throw new AppError(404, "Post not found");
  const user = await AuthModel.findOne({ _id: userId, is_deleted: false });
  if (!user) throw new AppError(404, "User not found");
  const result = await PostModel.findOneAndUpdate(
    { _id: postId },
    { $addToSet: { not_interests: userId } },
    { new: true }
  );
  return result;
};

const postServices = {
  createPost,
  getAllPosts,
  addNotInterested,
};

export default postServices;
