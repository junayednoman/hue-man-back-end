import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import paymentControllers from "./payment.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { paymentValidationSchema, portiaPaymentSchema } from "./payment.validation";

const paymentRouters = Router();

paymentRouters.post("/create-session", authVerify(["user"]), handleZodValidation(paymentValidationSchema), paymentControllers.createPaymentSession);
paymentRouters.post("/create-portia-payment-session", handleZodValidation(portiaPaymentSchema), paymentControllers.paymentSessionForPortia);
paymentRouters.get("/callback", paymentControllers.paymentCallback);
paymentRouters.get("/portia-callback", paymentControllers.portiaProPaymentCallback);
paymentRouters.get("/", authVerify(["admin"]), paymentControllers.getAllPayments);
paymentRouters.get("/:id", authVerify(["admin", "user"]), paymentControllers.getSinglePayment);

export default paymentRouters;