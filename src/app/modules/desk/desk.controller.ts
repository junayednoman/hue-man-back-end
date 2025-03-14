import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { deskServices } from "./desk.service";

const addToDesk = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await deskServices.addToDesk(payload);
  successResponse(res, {
    message: "Card added to desk successfully!",
    data: result,
    status: 201
  });
});

const getAllDeskCards = handleAsyncRequest(async (req: any, res) => {
  const id = req?.user?.id;
  const result = await deskServices.getAllDeskCards(id);
  successResponse(res, {
    message: "Cards retrieved from desk successfully!",
    data: result,
  });
});

const removeFromDesk = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const userId = req?.user?.id;
  const result = await deskServices.removeFromDesk(id, userId);
  successResponse(res, {
    message: "Card deleted from desk successfully!",
    data: result,
  });
});

const changeIndex = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const userId = req?.user?.id;
  const index = req.body.index;
  const result = await deskServices.changeIndex(id, index, userId);
  successResponse(res, {
    message: "Card index updated successfully!",
    data: result,
  });
});

export const deskControllers = {
  addToDesk,
  removeFromDesk,
  getAllDeskCards,
  changeIndex
};