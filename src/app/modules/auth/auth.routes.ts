import { Router } from "express";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import {
  createNewPasswordValidationSchema,
  emailValidationSchema,
  loginUserValidationSchema,
  resetForgottenPasswordSchema,
  verifyOtpSchema,
} from "./auth.validation";
import AuthController from "./auth.controller";
import { userSignupValidationSchema } from "../user/user.validation";
import userControllers from "../user/user.controller";
import authVerify from "../../middlewares/authVerify";

const authRouters = Router();
authRouters.post(
  "/sign-up",
  handleZodValidation(userSignupValidationSchema),
  userControllers.signUp
);
authRouters.post(
  "/login",
  handleZodValidation(loginUserValidationSchema),
  AuthController.loginUser
);
authRouters.post(
  "/send-otp",
  handleZodValidation(emailValidationSchema),
  AuthController.sendOtp
);
authRouters.post(
  "/verify-otp",
  handleZodValidation(verifyOtpSchema),
  AuthController.verifyOtp
);
authRouters.post(
  "/reset-forgotten-password",
  handleZodValidation(resetForgottenPasswordSchema),
  AuthController.resetForgottenPassword
);
authRouters.post(
  "/create-new-password",
  authVerify(["user", "admin"]),
  handleZodValidation(createNewPasswordValidationSchema),
  AuthController.createNewPassword
);
authRouters.get(
  "/sub-accounts",
  authVerify(["user"]),
  AuthController.getSubAccounts
);
authRouters.delete(
  "/sub-accounts/:subAccountId",
  authVerify(["user"]),
  AuthController.deleteSubAccount
);

export default authRouters;
