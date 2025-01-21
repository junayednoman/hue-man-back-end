import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { privacyServices } from "./privacy.service";

const createPrivacy = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await privacyServices.createPrivacy(payload);
  successResponse(res, {
    message: "Privacy created successfully!",
    data: result,
    status: 201,
  });
});

const getPrivacy = handleAsyncRequest(async (req, res) => {
  const result = await privacyServices.getPrivacy();
  successResponse(res, {
    message: "Privacy retrieved successfully!",
    data: result,
  });
});

const updatePrivacy = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await privacyServices.updatePrivacy(id, payload);
  successResponse(res, {
    message: "Privacy updated successfully!",
    data: result,
  });
});


export const privacyControllers = {
  createPrivacy,
  getPrivacy,
  updatePrivacy
};
