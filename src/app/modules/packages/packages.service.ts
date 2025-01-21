import { AppError } from "../../classes/appError";
import { TPackage } from "./packages.interface";
import PackageModel from "./packages.model";

const getAllPackages = async () => {
  const packages = await PackageModel.find();
  return packages;
}

const getSinglePackage = async (id: string) => {
  const packageItem = await PackageModel.findById(id)
  if (!packageItem) {
    throw new AppError(404, "Could not find the package", "id")
  }
  return packageItem;
}

const updatePackage = async (id: string, payload: Partial<TPackage>) => {
  const packageItem = await PackageModel.findById(id)
  if (!packageItem) {
    throw new AppError(404, "Could not find the package", "id")
  }

  const result = await PackageModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
}

const packageServices = {
  getAllPackages,
  getSinglePackage,
  updatePackage
}

export default packageServices;