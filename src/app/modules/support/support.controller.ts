import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import supportServices from "./support.service";

const sendSupportMessage = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await supportServices.sendSupportMessage(payload);
  successResponse(res, {
    message: "Support message sent successfully!",
    data: result
  });
});

const geTSupportMessageMessages = handleAsyncRequest(async (req: any, res) => {
  const result = await supportServices.geTSupportMessageMessages();
  successResponse(res, {
    message: "Support messages retrieved successfully!",
    data: result
  });
});

const getSingleSupportMessage = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id
  const result = await supportServices.getSingleSupportMessage(id);
  successResponse(res, {
    message: "Support message retrieved successfully!",
    data: result
  });
});

const supportMessageControllers = {
  sendSupportMessage,
  geTSupportMessageMessages,
  getSingleSupportMessage
};

export default supportMessageControllers;