import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { TUserProfile } from "./user.interface";
import userServices from "./user.service";

const signUp = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await userServices.signUp(payload);
  successResponse(res, {
    message: "User created successfully!",
    data: result,
    status: 201,
  });
});

const getAllUsers = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const result = await userServices.getAllUsers(query);
  successResponse(res, {
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getSingleUser = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const result = await userServices.getSingleUser(id);
  successResponse(res, {
    message: "User retrieved successfully!",
    data: result,
  });
});

const updateUser = handleAsyncRequest(async (req: any, res) => {
  const email = req?.user?.email;

  // Handle uploaded file (if any)
  const imageFile = req.file;

  const image = `/images/${imageFile?.filename}`;

  const textData = JSON.parse(req?.body?.data);

  const payload: Partial<TUserProfile> = {
    image: imageFile?.filename ? image : undefined,
    ...textData,
  };

  const result = await userServices.updateUser(email, payload);
  successResponse(res, {
    message: "User updated successfully!",
    data: result,
  });
});

const deleteUser = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const email = req?.user?.email;
  const result = await userServices.deleteUser(id, email);
  successResponse(res, {
    message: "User deleted successfully!",
    data: result,
  });
});

const userControllers = {
  signUp,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};

export default userControllers;
