import mongoose from "mongoose";
import { TStory } from "./story.interface";

const storySchema = new mongoose.Schema<TStory>({
  image: { type: String, required: true },
  title: { type: String, required: true },
  slides: [
    {
      image: { type: String, required: true },
      description: { type: String, required: true },
    }
  ],
});

export const StoryModel = mongoose.model<TStory>('Story', storySchema);