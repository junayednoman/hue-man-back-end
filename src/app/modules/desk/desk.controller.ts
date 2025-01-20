import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { deskServices } from "./desk.service";

const addToDesk = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await deskServices.addToDesk(payload);
  successResponse(res, {
    message: "Card added to desk successfully!",
    data: result,
  });
});

export const deskControllers = {
  addToDesk,
};