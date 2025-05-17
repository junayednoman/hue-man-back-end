import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { printServices } from "./print.service";

const getPrints = handleAsyncRequest(async (req: any, res) => {
  const id = req?.user?.id;
  const result = await printServices.getPrints(id);
  successResponse(res, {
    message: "Print count retrieved successfully!",
    data: result,
  });
});

const increaseCount = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const result = await printServices.increaseCount(id);
  successResponse(res, {
    message: "Print count retrieved successfully!",
    data: result,
  });
});

export const printControllers = {
  getPrints,
  increaseCount
};