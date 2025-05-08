import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import paymentControllers from "./payment.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { paymentValidationSchema } from "./payment.validation";

const paymentRouters = Router();

paymentRouters.post("/create-session", authVerify(["user"]), handleZodValidation(paymentValidationSchema), paymentControllers.createPaymentSession);
paymentRouters.get("/callback", paymentControllers.paymentCallback);
paymentRouters.get("/", authVerify(["admin"]), paymentControllers.getAllPayments);
paymentRouters.get("/:id", authVerify(["admin", "user"]), paymentControllers.getSinglePayment);

export default paymentRouters;