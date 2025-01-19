import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import AuthServices from "./auth.service";

const loginUser = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.loginUser(payload);
  successResponse(res, {
    message: "User logged in successfully!",
    data: result,
  });
});

const sendOtp = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.sendOtp(payload);
  successResponse(res, {
    data: result,
    message: "OTP sent successfully!",
  });
});

const verifyOtp = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  await AuthServices.verifyOtp(payload);
  successResponse(res, {
    message: "OTP verified successfully!",
  });
});

const resetForgottenPassword = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  await AuthServices.resetForgottenPassword(payload);
  successResponse(res, {
    message: "Password reset successfully!",
  });
});

const createNewPassword = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.createNewPassword(payload);
  successResponse(res, {
    message: "New password created successfully!",
    data: result,
  });
});

const AuthController = {
  loginUser,
  sendOtp,
  verifyOtp,
  resetForgottenPassword,
  createNewPassword,
};

export default AuthController;
