import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import subscriptionServices from "./subscription.service";

const createOrUpdateSubscription = handleAsyncRequest(async (req: any, res) => {
  const userId = req?.user.id;
  const amount = req.body.amount;
  const package_name = req.body.package_name;
  const currency = req.body.currency || "usd";
  const duration = req.body.duration;
  const result = await subscriptionServices.createOrUpdateSubscription(userId, amount, currency, package_name, duration);
  successResponse(res, {
    message: "Subscription created successfully!",
    data: result,
    status: 201
  });
});

const getAllSubscriptions = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const result = await subscriptionServices.getAllSubscriptions(query);
  successResponse(res, {
    message: "Subscriptions retrieved successfully!",
    data: result
  });
});

const getSingleSubscription = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const result = await subscriptionServices.getSingleSubscription(id);
  successResponse(res, {
    message: "Subscription retrieved successfully!",
    data: result
  });
});

const getMySubscription = handleAsyncRequest(async (req: any, res) => {
  const id = req.user.id;
  const web = req.query.web || false;
  const result = await subscriptionServices.getMySubscription(id, web);
  successResponse(res, {
    message: "Subscription retrieved successfully!",
    data: result
  });
});


const subscriptionControllers = {
  createOrUpdateSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  getMySubscription
};

export default subscriptionControllers;