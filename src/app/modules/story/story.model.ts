import mongoose from "mongoose";
import { TStory } from "./story.interface";

const storySchema = new mongoose.Schema<TStory>({
  images: { type: [String], required: true },
  text: { type: String, required: true },
});

export const StoryModel = mongoose.model<TStory>('Story', storySchema);