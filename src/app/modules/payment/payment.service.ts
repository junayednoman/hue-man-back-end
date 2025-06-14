import Payment from "./payment.model";
import QueryBuilder from "../../classes/queryBuilder";
import Stripe from "stripe";
import config from "../../config";
import { AppError } from "../../classes/appError";
import mongoose from "mongoose";
import Subscription from "../subscription/subscription.model";
import { generateTransactionId } from "../../utils/transactionIdGenerator";
import { printServices } from "../print/print.service";
import AuthModel from "../auth/auth.model";

// Initialize the Stripe client
const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2024-12-18.acacia",
});

const createPaymentSession = async (package_name: 'monthly' | 'yearly' | 'single' | 'bundle' | 'combo', email: string, currency: string, price: number, web = false) => {
  const user = await AuthModel.findOne({ email });
  if (!user) throw new AppError(401, "Unauthorized");

  const transaction_id = generateTransactionId()

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `Subscribe to ${package_name?.replace(/^\w/, c => c.toUpperCase())} plan`,
          },
          unit_amount: Math.ceil(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: email,
    success_url: `${config.payment_success_url}?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transaction_id}&duration=${package_name === "monthly" ? 1 : 12}&userId=${user?._id}&web=${web}&email=${email}&package_name=${package_name}`,
    cancel_url: config.payment_cancel_url,
  });

  return { url: session.url };
}

const paymentCallback = async (query: Record<string, any>) => {
  const { session_id, transaction_id, duration, userId, web, email, package_name } = query;
  const paymentSession = await stripe.checkout.sessions.retrieve(session_id);
  const isPaymentExist = await Payment.findOne({ transaction_id });

  if (isPaymentExist) {
    return { web: web === "true" ? true : false }
  }

  const session = await mongoose.startSession();
  if (paymentSession.payment_status === 'paid') {
    if (web === "true") {
      await printServices.createPrints(email);
    }

    session.startTransaction();

    const paymentData = {
      user: userId,
      amount: (paymentSession.amount_total! / 100).toFixed(2),
      transaction_id,
      status: "paid",
      currency: paymentSession.currency,
    };

    const start_date = new Date();
    if (isNaN(start_date.getTime())) {
      throw new AppError(400, "Invalid start date");
    }

    let end_date = new Date(start_date);

    end_date.setMonth(start_date.getMonth() + Number(duration));

    const subscription = await Subscription.findOne({ user: userId, web: web === "true" ? true : false });

    if (web === "false" && subscription) {
      const previous_end_date = subscription.end_date;
      if (previous_end_date && !isNaN(previous_end_date.getTime())) {
        const monthsRemaining = Math.max(0, (previous_end_date.getFullYear() - start_date.getFullYear()) * 12 + previous_end_date.getMonth() - start_date.getMonth());
        end_date = new Date(start_date);
        end_date.setMonth(start_date.getMonth() + monthsRemaining + Number(duration));
      }
    }

    const subscriptionData = {
      user: userId,
      start_date,
      end_date,
      status: "active",
      package_name
    };

    try {
      await Payment.create([paymentData], { session });
      await Subscription.findOneAndUpdate({ user: userId, web: web === "true" ? true : false }, subscriptionData, { session, upsert: true });

      await session.commitTransaction();
      return { message: "Payment successful", success: true, web: web === "true" ? true : false };
    } catch (error: any) {
      await session.abortTransaction();
      throw new AppError(500, error.message || "Error verifying payment");
    } finally {
      session.endSession();
    }
  } else throw new AppError(400, "Payment failed!");
};

const getAllPayments = async (query: Record<string, any>) => {
  const searchableFields = [
    "amount",
    "status",
    "transaction_id"
  ];
  const userQuery = new QueryBuilder(
    Payment.find(),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel.populate("user", "name email");
  return { data: result, meta };
};

const getSinglePayment = async (id: string) => {
  const result = await Payment.findOne({ _id: id }).populate("user", "name email");
  return result;
}

export const paymentServices = {
  createPaymentSession,
  getAllPayments,
  getSinglePayment,
  paymentCallback
}