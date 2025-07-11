import QueryBuilder from "../../classes/queryBuilder";
import { TStory } from "./story.interface";
import { StoryModel } from "./story.model";

const createStory = async (payload: TStory) => {
  const result = await StoryModel.create(payload);
  return result;
};

const createStories = async (payload: TStory[]) => {
  const result = await StoryModel.insertMany(payload);
  return result;
};

const getAllStories = async (query: Record<string, any>) => {
  const searchableFields = ["text"];

  const storyQuery = new QueryBuilder(
    StoryModel.find(),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await storyQuery.countTotal();
  const result = await storyQuery.queryModel;
  return { data: result, meta };
}

export const storyServices = { createStories, getAllStories, createStory };