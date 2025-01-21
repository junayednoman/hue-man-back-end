import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { TermsServices } from "./terms.service";
const createTerms = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await TermsServices.createTerms(payload);
  successResponse(res, {
    message: "Terms created successfully!",
    data: result,
    status: 201,
  });
});

const getTerms = handleAsyncRequest(async (req, res) => {
  const result = await TermsServices.getTerms();
  successResponse(res, {
    message: "Terms retrieved successfully!",
    data: result,
  });
});

const updateTerms = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await TermsServices.updateTerms(id, payload);
  successResponse(res, {
    message: "Terms updated successfully!",
    data: result,
  });
});


export const termsControllers = {
  createTerms,
  getTerms,
  updateTerms
};
