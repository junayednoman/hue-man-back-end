import mongoose from "mongoose";
import UserModel from "./user.model";
import { AppError } from "../../classes/appError";
import AuthModel from "../auth/auth.model";
import config from "../../config";
import { TSignUp } from "./user.validation";
import bcrypt from "bcrypt";
import QueryBuilder from "../../classes/queryBuilder";
import { TUserProfile } from "./user.interface";
import { deleteFile } from "../../utils/deleteFile";
import generateOTP from "../../utils/generateOTP";
import { sendEmail } from "../../utils/sendEmail";

const signUp = async (payload: TSignUp) => {
  console.log('payload', payload);
  // check if user exists
  const auth = await AuthModel.findOne({ email: payload.email, is_account_verified: true });
  if (auth) {
    throw new AppError(400, "User already exists");
  }

  const session = await mongoose.startSession();

  try {
    const { password, ...userData } = payload;
    session.startTransaction();
    // Create auth data
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.salt_rounds)
    );



    // generate OTP and send email
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(
      otp.toString(),
      Number(config.salt_rounds)
    );

    const otp_expires = new Date(Date.now() + 3 * 60 * 1000);
    const subject = `Your OTP Code is Here - Hue-Man Expressions`;
    const htmlMarkup = `<p>Hi,</p>
  <p>Please use the following One-Time Password (OTP) to verify your account:</p>
  <h2 style="color: #2e6c80;">${otp}</h2>
  <p>This OTP is valid for 3 minutes. If you did not request this, please ignore this email or contact our support team.</p>
  <p>Thank you,</p>
  <p>Hue-Man Expressions</p>`;

    const authData = {
      email: payload.email,
      password: hashedPassword,
      parent_id: payload.parent_id || null,
      otp: hashedOtp,
      otp_expires,
      otp_attempts: 0,
    } as any;

    const newUser = await UserModel.findOneAndUpdate({ email: payload.email }, userData, { session, upsert: true, new: true });

    authData.user = newUser?._id
    await AuthModel.findOneAndUpdate({ email: payload.email }, authData, { session, upsert: true, new: true });

    if (newUser) {
      sendEmail(payload.email, subject, htmlMarkup);
    }

    await session.commitTransaction();
    return newUser;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error creating athlete");
  } finally {
    session.endSession();
  }
};

const getAllUsers = async (query: Record<string, any>) => {
  const searchableFields = [
    "name",
    "email",
    "gender",
    "age",
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
  const result = await userQuery.queryModel.populate("user");
  return { data: result, meta };
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

const getProfile = async (email: string) => {
  const user = await UserModel.findOne({ email });
  const auth = await AuthModel.findOne({ email });
  return { ...user?.toObject(), user_id: auth?._id };
};

const updateUser = async (
  email: string,
  payload: Partial<TUserProfile>,
) => {
  // return console.log('payload', payload);
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const userOldImg = user.image;

  if (email && email !== user.email) {
    throw new AppError(403, "Forbidden");
  }

  const result = await UserModel.findByIdAndUpdate(user._id, payload, {
    new: true,
  });

  if (result && payload.image && userOldImg) {
    await deleteFile(userOldImg);
  }

  return result;
};

const deleteUser = async (_id: string, userEmail: string) => {
  const user = await UserModel.findOne({
    _id,
    is_blocked: false,
  });

  if (!user) throw new AppError(404, "User not found");

  if (user.is_deleted) throw new AppError(400, "User already deleted");

  if (userEmail && userEmail !== user.email) {
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
      { email: user.email },
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
  getProfile
};
export default userServices;
