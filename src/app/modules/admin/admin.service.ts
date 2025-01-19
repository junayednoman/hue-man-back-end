import { AppError } from "../../classes/appError";
import { TAdmin } from "./admin.interface";
import AdminModel from "./admin.model";

const getAdminById = async (id: string) => {
  const admin = await AdminModel.findById(id);
  if (!admin) {
    throw new AppError(404, "Admin not found");
  }
  return admin;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
  const admin = await AdminModel.findById(id);
  if (!admin) {
    throw new AppError(404, "Admin not found");
  }
  return AdminModel.findByIdAndUpdate(admin._id, payload, { new: true });
};

export const adminServices = { updateAdmin, getAdminById };
