import mongoose from "mongoose";
import UserModel from "./user.model";
import { AppError } from "../../classes/appError";
import AuthModel from "../auth/auth.model";
import config from "../../config";
import { TSignUp } from "./user.validation";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import QueryBuilder from "../../classes/queryBuilder";
import { TUserProfile } from "./user.interface";

const signUp = async (payload: TSignUp) => {
  // check if user exists
  const auth = await AuthModel.findOne({ email: payload.email });
  const user = await UserModel.findOne({ owner_email: payload.email });
  if (auth && user) {
    throw new AppError(400, "User already exists");
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Create auth data
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.salt_rounds)
    );
    const authData = {
      email: payload.email,
      password: hashedPassword,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete payload.password;

    const newAuth = await AuthModel.create([authData], { session });
    const userData = {
      name: payload.name,
      owner_email: payload.email,
    };
    const newUser = await UserModel.create([userData], { session });

    // generate token
    const jwtPayload = {
      email: payload.email,
      role: "user",
      id: newAuth[0]?._id,
    };
    const token = await jsonwebtoken.sign(
      jwtPayload,
      config.jwt_secret as string,
      { expiresIn: config.jwt_expiration }
    );
    await session.commitTransaction();
    return { token, user: newUser[0] };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error creating athlete");
  } finally {
    session.endSession();
  }
};

const getAllUsers = async (query: Record<string, any>) => {
  const searchableFields = [
    "college_name",
    "coach_name",
    "coach_title",
    "coach_email",
  ];
  const userQuery = new QueryBuilder(
    UserModel.find({
      is_deleted: false,
      is_blocked: false,
    }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel;
  return { data: result, meta };
  // return await UserModel.find({ is_blocked: false, is_deleted: false });
};

const getSingleUser = async (id: string) => {
  const user = await UserModel.findOne({
    _id: id,
    is_blocked: false,
    is_deleted: false,
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<TUserProfile>,
  userEmail: string
) => {
  const user = await UserModel.findOne({
    _id: id,
    is_blocked: false,
    is_deleted: false,
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (userEmail && userEmail !== user.owner_email) {
    throw new AppError(401, "Unauthorized");
  }
  const result = await UserModel.findByIdAndUpdate(user._id, payload, {
    new: true,
  });
  return result;
};

const deleteUser = async (_id: string, userEmail: string) => {
  const user = await UserModel.findOne({
    _id,
    is_blocked: false,
  });

  if (!user) throw new AppError(404, "User not found");

  if (user.is_deleted) throw new AppError(400, "User already deleted");

  if (userEmail && userEmail !== user.owner_email) {
    throw new AppError(401, "Unauthorized");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Update the user record to mark as deleted
    const result = await UserModel.findByIdAndUpdate(
      user._id,
      { is_deleted: true },
      { session, new: true }
    );

    // Update related AuthModel record
    await AuthModel.findOneAndUpdate(
      { email: user.owner_email },
      { is_deleted: true },
      { session }
    );

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    const errorMessage = error?.message || "Error deleting user";
    throw new AppError(500, errorMessage);
  } finally {
    session.endSession();
  }
};

const userServices = {
  signUp,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
export default userServices;
