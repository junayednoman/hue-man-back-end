import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { storyServices } from "./story.service";

const createStories = handleAsyncRequest(async (req, res) => {
  const payload = req.body;

  const result = await storyServices.createStories(payload)
  successResponse(res, {
    message: "Story created successfully!",
    data: result,
    status: 201,
  });
});

const getAllStories = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const result = await storyServices.getAllStories(query)
  successResponse(res, {
    message: "Storieved ses retriuccessfully!",
    data: result,
  });
});

export const storyControllers = {
  createStories,
  getAllStories
};