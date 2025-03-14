import { Router } from "express";
import { storyControllers } from "./story.controller";
import { uploadMultipleIMages } from "../../utils/multerFIleUploader";

const storyRouters = Router();

storyRouters.post("/", uploadMultipleIMages, storyControllers.createStory);
storyRouters.get("/", storyControllers.getAllStories);

export default storyRouters;