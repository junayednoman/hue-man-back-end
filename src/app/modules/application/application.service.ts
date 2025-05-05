import UserModel from "../user/user.model";
import { TApplication } from "./application.interface";
import ApplicationModel from "./application.model";

const createApplication = async (payload: TApplication, email: string) => {
  const user = await UserModel.findOne({ email });

  const application = await ApplicationModel.findOne({ user: user?._id });
  if (application) {
    throw new Error("Application already exists");
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  payload.user = user!._id;
  const result = await ApplicationModel.create(payload);
  return result;
};

const getApplications = async () => {
  const result = await ApplicationModel.find({});
  return result;
}

const getApplication = async (id: string) => {
  const result = await ApplicationModel.findById(id);
  console.log('result', id);
  return result;
}

const applicationServices = {
  createApplication,
  getApplications,
  getApplication
}

export default applicationServices;