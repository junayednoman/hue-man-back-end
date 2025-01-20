import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { faqService } from "./faq.service";

const createFaqs = handleAsyncRequest(async (req, res) => {
  const payload = req.body;
  const result = await faqService.createFaqs(payload);
  successResponse(res, {
    message: "Faqs created successfully!",
    data: result,
  });
});

const getAllFaqs = handleAsyncRequest(async (req, res) => {
  const result = await faqService.getAllFaqs();
  successResponse(res, {
    message: "Faqs retrieved successfully!",
    data: result,
  });
});

export const faqControllers = {
  createFaqs,
  getAllFaqs
};