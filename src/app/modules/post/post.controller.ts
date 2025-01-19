import { handleZodValidation } from "../../middlewares/handleZodValidation";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import postServices from "./post.service";
import { createPostValidationSchema } from "./post.validation";

const createPost = handleAsyncRequest(async (req, res) => {
  // Handle uploaded file (if any)
  const imageFiles = req.files;

  let images: string[] = [];
  if (imageFiles && imageFiles.length) {
    images = (imageFiles as any[])?.map((file: any) => file.location);
  }

  const textData = JSON.parse(req?.body?.data);

  const payload = {
    images,
    ...textData,
  };

  handleZodValidation(createPostValidationSchema);

  const result = await postServices.createPost(payload);
  successResponse(res, {
    message: "Post created successfully!",
    data: result,
    status: 201,
  });
});

const getAllPosts = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const currentUser = req?.body?.currentUser;
  const result = await postServices.getAllPosts(query, currentUser);
  successResponse(res, {
    message: "Posts retrieved successfully!",
    data: result,
  });
});

const addNotInterested = handleAsyncRequest(async (req, res) => {
  const post = req?.body?.postId;
  const user = req?.body?.userId;
  const result = await postServices.addNotInterested(post, user);
  successResponse(res, {
    message: "User added to not interested list successfully!",
    data: result,
  });
});

const postControllers = {
  createPost,
  getAllPosts,
  addNotInterested,
};

export default postControllers;
