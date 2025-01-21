import handleAsyncRequest from '../../utils/handleAsyncRequest';
import { successResponse } from '../../utils/successResponse';
import { paymentServices, subscriptionServices } from './subscription.service';

const manageSubscriptions = handleAsyncRequest(async (req, res) => {
  const body = req.body;
  const signature = req.headers['stripe-signature'];
  const result = await subscriptionServices.manageSubscriptions(body, signature);

  successResponse(res, {
    message: 'Subscription created successfully!',
    data: result,
    status: 201,
  });
});

export const subscriptionController = {
  manageSubscriptions,
};

// payment controllers
const getPayments = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const result = await paymentServices.getPayments(query);
  successResponse(res, {
    message: 'Payments retrieved successfully!',
    data: result,
  });
});

const getSinglePayment = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const result = await paymentServices.getSinglePayment(id);
  successResponse(res, {
    message: 'Payment retrieved successfully!',
    data: result,
  });
});

export const paymentController = {
  getPayments,
  getSinglePayment,
};
