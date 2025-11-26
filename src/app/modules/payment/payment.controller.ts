import config from "../../config";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { paymentServices } from "./payment.service";

const createPaymentSession = handleAsyncRequest(async (req: any, res) => {
  const package_name = req.body.package_name;
  const email = req.user.email;
  const currency = req.body.currency || "usd";
  const price = req.body.price;
  const web = req.body.web;
  const address = req.body.address;

  const result = await paymentServices.createPaymentSession(
    package_name,
    email,
    currency,
    price,
    web,
    address
  );
  successResponse(res, {
    message: "Payment session created successfully!",
    data: result,
    status: 201,
  });
});

const getAllPayments = handleAsyncRequest(async (req, res) => {
  const query = req.query;
  const result = await paymentServices.getAllPayments(query);
  successResponse(res, {
    message: "Payments retrieved successfully!",
    data: result,
  });
});

const paymentCallback = handleAsyncRequest(async (req: any, res) => {
  const query = req.query;
  const result = await paymentServices.paymentCallback(query);
  if (!result.web) {
    successResponse(res, {
      message: "Payment successful!",
    });
  } else if (result?.success && result.web) {
    return res.redirect(config.payment_success_page!);
  }
});

const getSinglePayment = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const result = await paymentServices.getSinglePayment(id);
  successResponse(res, {
    message: "Payment retrieved successfully!",
    data: result,
  });
});

const paymentSessionForPortia = handleAsyncRequest(async (req, res) => {
  const result = await paymentServices.paymentSessionForPortia(
    req.body.price,
    req.body.payload
  );
  successResponse(res, {
    message: "Payment session created successfully!",
    data: result,
    status: 201,
  });
});

const portiaProPaymentCallback = handleAsyncRequest(async (req, res) => {
  await paymentServices.portiaProPaymentCallback(req.query);

  res.redirect(config.portia_payment_success_url as string);
});

const paymentControllers = {
  getAllPayments,
  getSinglePayment,
  paymentCallback,
  createPaymentSession,
  paymentSessionForPortia,
  portiaProPaymentCallback,
};

export default paymentControllers;
