import { TFaq } from "./faq.interface";
import { FaqModel } from "./faq.model";

const createFaqs = async (payload: TFaq[]) => {
  const result = await FaqModel.insertMany(payload);
  return result;
}

const getAllFaqs = async () => {
  const faqs = await FaqModel.find();
  return faqs;
}

export const faqService = { createFaqs, getAllFaqs };