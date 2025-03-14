import config from "../../config";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import AuthServices from "./auth.service";

const loginUser = handleAsyncRequest(async (req, res) => {
  const payload = req.body;

  const result = await AuthServices.loginUser(payload);
  // set refreshToken in cookie
  const day = 24 * 60 * 60 * 1000
  const { refreshToken, accessToken } = result;

  // set refreshToken in cookie
  const cookieOptions: any = {
    httpOnly: true,
    secure: config.node_env === 'production', // Use secure in production
    maxAge: payload.isRememberMe ? 30 * day : 3 * day,
  };

  if (config.node_env === 'production') cookieOptions.sameSite = 'none';

  res.cookie('refreshToken', refreshToken, cookieOptions);

  successResponse(res, {
    message: "User logged in successfully!",
    data: { accessToken },
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

const createNewPassword = handleAsyncRequest(async (req: any, res) => {
  const email = req.user.email
  const payload = req.body;
  const result = await AuthServices.createNewPassword(email, payload);

  // set refreshToken in cookie
  const day = 24 * 60 * 60 * 1000
  const { refreshToken, accessToken } = result;
  const cookieOptions: any = {
    httpOnly: true,
    secure: config.node_env === 'production', // Use secure in production
    maxAge: 3 * day,
  };

  if (config.node_env === 'production') cookieOptions.sameSite = 'none';

  res.cookie('refreshToken', refreshToken, cookieOptions);

  successResponse(res, {
    message: "New password created successfully!",
    data: { accessToken },
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
