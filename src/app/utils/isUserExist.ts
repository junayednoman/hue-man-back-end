import { StatusCodes } from "http-status-codes";
import { AppError } from "../classes/appError";
import AuthModel from "../modules/auth/auth.model";

const isUserExist = async (email: string) => {
  // check if user exists
  const user = await AuthModel.findOne({
    email,
    is_deleted: false,
    is_blocked: false,
  });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "Incorrect user email", "email");
  }
  return user;
};
export default isUserExist;
