import { AppError } from "../../classes/appError";
import AuthModel from "./auth.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import config from "../../config";
import generateOTP from "../../utils/generateOTP";
import { sendEmail } from "../../utils/sendEmail";
import isUserExist from "../../utils/isUserExist";

const loginUser = async (payload: { email: string; password: string, is_remember?: boolean }) => {
  const user = await isUserExist(payload.email);

  if (!user.is_account_verified) throw new AppError(StatusCodes.BAD_REQUEST, "Account not verified");
  // Compare the password
  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect password",
      "password"
    );
  }

  // generate token
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  const accessToken = jsonwebtoken.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expiration,
  });

  const refreshToken = jsonwebtoken.sign(jwtPayload, config.jwt_refresh_secret as string, {
    expiresIn: payload?.is_remember ? "30d" : "3d",
  });
  return { accessToken, refreshToken, role: user.role };
};

const sendOtp = async (payload: { email: string }) => {
  const user = await isUserExist(payload.email);

  // generate OTP and send email
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(
    otp.toString(),
    Number(config.salt_rounds)
  );

  // prepare email content
  const otp_expires = new Date(Date.now() + 3 * 60 * 1000);
  const subject = `Your OTP Code is Here - Hue-man Expressions`;
  const htmlMarkup = `<p>Hi,</p>
  <p>Please use the following One-Time Password (OTP) to verify your email address:</p>
  <h2 style="color: #2e6c80;">${otp}</h2>
  <p>This OTP is valid for 3 minutes. If you did not request this, please ignore this email or contact our support team.</p>
  <p>Thank you,</p>
  <p>Hue-man Expressions</p>`;

  sendEmail(payload.email, config.sender_email, subject, htmlMarkup);

  await AuthModel.findByIdAndUpdate(
    user._id,
    { otp: hashedOtp, otp_expires, otp_attempts: 0 },
    { new: true }
  );
  return { email: payload.email }
};

const verifyOtp = async (payload: {
  email: string;
  otp: string;
  verify_account?: boolean;
}) => {
  const user = await isUserExist(payload.email);

  // check OTP attempts
  if (user.otp_attempts! > 3) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP attempts exceeded", "otp");
  }

  user.otp_attempts = user.otp_attempts ? user.otp_attempts! + 1 : 1;
  user.save();

  if (!user.otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP not found", "otp");
  }

  // verify OTP
  const isOtpMatch = await bcrypt.compare(payload.otp, user.otp as string);
  if (!isOtpMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP", "otp");
  }

  if (user.otp_expires! < new Date()) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP has expired", "otp");
  }

  // send email if user account is verified
  if (payload.verify_account) {
    const subject = `Your Email Has Been Successfully Verified - Hue-man Expressions`;
    const htmlMarkup = `<p>Hi,</p>
    <p>Congratulations! Your email address has been successfully verified.</p>
    <p>You can now enjoy all the features of your account without any restrictions.</p>
    <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>
    <p>Thank you,</p>
    <p>Hue-man Expressions</p>`;

    sendEmail(payload.email, config.sender_email, subject, htmlMarkup);
    return await AuthModel.findByIdAndUpdate(user._id, {
      is_account_verified: true,
      $unset: { otp: "", otp_expires: "", otp_attempts: "" },
    });
  }

  await AuthModel.findByIdAndUpdate(user._id, {
    is_otp_verified: true,
    $unset: { otp: "", otp_expires: "", otp_attempts: "" },
  });
};

const resetForgottenPassword = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await isUserExist(payload.email);

  if (!user.is_otp_verified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP not verified", "otp");
  }

  // hash the password and save the document
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_rounds)
  );
  const newAuth = await AuthModel.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    $unset: { is_otp_verified: "" },
  });

  // send email if password is reset
  if (newAuth) {
    const subject = `Password Reset Confirmation - Hue-man Expressions`;
    const htmlMarkup = `<p>Hi,</p>
  <p>Your password has been successfully reset. You can now log in to your account using your new password.</p>
  <p>If you did not request this password reset, please contact our support team immediately.</p>
  <p>Thank you,</p>
  <p>Hue-man Expressions</p>`;

    sendEmail(payload.email, config.sender_email, subject, htmlMarkup);
  }
};

const createNewPassword = async (email: string, payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  const user = await isUserExist(email);

  // Compare the password
  const isPasswordMatch = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );
  if (!isPasswordMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect password",
      "password"
    );
  }

  // hash the new password and save the document
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_rounds)
  );

  await AuthModel.findByIdAndUpdate(user._id, { password: hashedPassword });

  // generate token
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  const accessToken = jsonwebtoken.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expiration,
  });

  const refreshToken = jsonwebtoken.sign(jwtPayload, config.jwt_refresh_secret as string, {
    expiresIn: "3d",
  });
  return { accessToken, refreshToken, role: user.role };
};

const getSubAccounts = async (userId: string) => {
  const subAccounts = await AuthModel.find({ parent_id: userId });
  return subAccounts
}

const deleteSubAccount = async (userId: string, subAccountId: string) => {
  const subAccount = await AuthModel.findById(subAccountId)
  if (!subAccount) throw new AppError(404, "Sub account not found")
  if (userId !== subAccountId) throw new AppError(403, "Forbidden")
  const result = await AuthModel.findByIdAndDelete(subAccountId)
  return result
}

const AuthServices = {
  loginUser,
  sendOtp,
  verifyOtp,
  resetForgottenPassword,
  createNewPassword,
  getSubAccounts,
  deleteSubAccount
};

export default AuthServices;
