import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import subscriptionControllers from "./subscription.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { subscriptionValidationSchema } from "./subscription.validation";

const subscriptionRouters = Router();

subscriptionRouters.post("/", authVerify(["user"]), handleZodValidation(subscriptionValidationSchema), subscriptionControllers.createOrUpdateSubscription);
subscriptionRouters.get('/', authVerify(["admin"]), subscriptionControllers.getAllSubscriptions);
subscriptionRouters.get('/my', authVerify(["user"]), subscriptionControllers.getMySubscription);
subscriptionRouters.get('/:id', authVerify(["admin"]), subscriptionControllers.getSingleSubscription);

export default subscriptionRouters;