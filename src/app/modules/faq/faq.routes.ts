import { Router } from "express";
import { faqControllers } from "./faq.controller";

const faqRouters = Router();

faqRouters.post('/', faqControllers.createFaqs);
faqRouters.get('/', faqControllers.getAllFaqs);

export default faqRouters;