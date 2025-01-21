import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import packageServices from "./packages.service";

const getAllPackages = handleAsyncRequest(
  async (req, res) => {
    const result = await packageServices.getAllPackages();
    successResponse((res), {
      message: "Packages retrieved successfully!", data: result
    })
  }
)

const getSinglePackage = handleAsyncRequest(
  async (req, res) => {
    const id = req.params.id;
    const result = await packageServices.getSinglePackage(id);
    successResponse((res), {
      message: "Package retrieved successfully!", data: result
    })
  }
)

const updatePackage = handleAsyncRequest(
  async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await packageServices.updatePackage(id, payload);
    successResponse((res), {
      message: "Package updated successfully!", data: result
    })
  }
)

const packageController = {
  getAllPackages,
  getSinglePackage,
  updatePackage
}

export default packageController;