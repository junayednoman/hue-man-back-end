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
  const email = req.user.email;
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

const getSubAccounts = handleAsyncRequest(async (req: any, res) => {
  const id = req?.user?.id;
  const result = await AuthServices.getSubAccounts(id);

  successResponse(res, {
    message: "Sub accounts retrieved successfully!",
    data: result,
  });
});

const deleteSubAccount = handleAsyncRequest(async (req: any, res) => {
  const userId = req?.user?.id;
  const subAccountId = req?.params?.subAccountId;
  const result = await AuthServices.deleteSubAccount(userId, subAccountId);

  successResponse(res, {
    message: "Sub accounts deleted successfully!",
    data: result,
  });
});

const AuthController = {
  loginUser,
  sendOtp,
  verifyOtp,
  resetForgottenPassword,
  createNewPassword,
  getSubAccounts,
  deleteSubAccount
};

export default AuthController;
