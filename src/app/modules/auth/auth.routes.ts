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
  handleZodValidation(createNewPasswordValidationSchema),
  AuthController.createNewPassword
);

export default authRouters;
