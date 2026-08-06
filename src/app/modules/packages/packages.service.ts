import { AppError } from "../../classes/appError";
import { TPackage } from "./packages.interface";
import PackageModel from "./packages.model";

const getAllPackages = async () => {
  const packages = await PackageModel.find({ is_active: true }).sort({ monthly_price: 1 });
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

const createPackage = async (payload: TPackage) => {
  return PackageModel.create(payload);
}

const packageServices = {
  getAllPackages,
  getSinglePackage,
  updatePackage,
  createPackage
}

export default packageServices;
