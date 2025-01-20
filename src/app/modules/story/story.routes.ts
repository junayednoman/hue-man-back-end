import { Router } from "express";
import { storyControllers } from "./story.controller";

const storyRouters = Router();

storyRouters.post("/", storyControllers.createStories);
storyRouters.get("/", storyControllers.getAllStories);

export default storyRouters;