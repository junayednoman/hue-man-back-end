import Payment from "./payment.model";
import QueryBuilder from "../../classes/queryBuilder";
import UserModel from "../user/user.model";
import Stripe from "stripe";
import config from "../../config";
import PackageModel from "../packages/packages.model";
import { AppError } from "../../classes/appError";
import mongoose from "mongoose";
import Subscription from "../subscription/subscription.model";
import { generateTransactionId } from "../../utils/transactionIdGenerator";

// Initialize the Stripe client
const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2024-12-18.acacia",
});

const createPaymentSession = async (package_name: string, email: string, currency: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) throw new AppError(401, "Unauthorized");

  const subscriptionPackage = await PackageModel.findOne({ package_name });

  if (!subscriptionPackage) throw new AppError(404, "Invalid package name");

  const transaction_id = generateTransactionId()

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `Subscribe to ${package_name?.replace(/^\w/, c => c.toUpperCase())} plan`,
          },
          unit_amount: Math.ceil(subscriptionPackage!.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: email,
    success_url: `${config.payment_success_url}?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transaction_id}&duration=${subscriptionPackage!.duration}&plan=${subscriptionPackage!._id}&userId=${user?._id}`,
    cancel_url: config.payment_cancel_url,
  });

  return { url: session.url };
}

const paymentCallback = async (query: Record<string, any>) => {
  const { session_id, transaction_id, duration, plan, userId } = query;
  const paymentSession = await stripe.checkout.sessions.retrieve(session_id);
  const isPaymentExist = await Payment.findOne({ transaction_id });
  if (isPaymentExist) {
    return;
  }
  
  const session = await mongoose.startSession();
  if (paymentSession.payment_status === 'paid') {
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

    end_date.setMonth(start_date.getMonth() + duration);

    const subscription = await Subscription.findOne({ user: userId });

    if (subscription) {
      const previous_end_date = subscription.end_date;
      if (previous_end_date && !isNaN(previous_end_date.getTime())) {
        const monthsRemaining = Math.max(0, (previous_end_date.getFullYear() - start_date.getFullYear()) * 12 + previous_end_date.getMonth() - start_date.getMonth());
        end_date = new Date(start_date);
        end_date.setMonth(start_date.getMonth() + monthsRemaining + duration);
      }
    }

    const subscriptionData = {
      user: userId,
      plan,
      start_date,
      end_date,
      status: "active",
    };

    try {
      await Payment.create([paymentData], { session });
      await Subscription.findOneAndUpdate({ user: userId }, subscriptionData, { session, upsert: true });

      await session.commitTransaction();
      return { message: "Payment successful" };
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