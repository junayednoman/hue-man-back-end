import mongoose from "mongoose";
import QueryBuilder from "../../classes/queryBuilder";
import { generateTransactionId } from "../../utils/transactionIdGenerator";
import Subscription from "./subscription.model";
import Payment from "../payment/payment.model";
import { AppError } from "../../classes/appError";
import PackageModel from "../packages/packages.model";

const createOrUpdateSubscription = async (
  userId: string,
  amount: number,
  currency: string,
  package_name: string,
  duration: number
) => {
  const transaction_id = generateTransactionId();
  const paymentData = {
    user: userId,
    amount,
    transaction_id,
    status: "paid",
    currency,
  };

  const start_date = new Date();
  let end_date = new Date(start_date);
  end_date.setMonth(start_date.getMonth() + duration);

  const subscription = await Subscription.findOne({ user: userId });

  if (subscription) {
    const previous_end_date = subscription.end_date;
    const monthsRemaining = Math.max(
      0,
      (previous_end_date.getFullYear() - start_date.getFullYear()) * 12 +
        previous_end_date.getMonth() -
        start_date.getMonth()
    );
    end_date = new Date(start_date);
    end_date.setMonth(start_date.getMonth() + monthsRemaining + duration);
  }

  const subscriptionData = {
    user: userId,
    plan: package_name,
    start_date,
    end_date,
    status: "active",
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    await Subscription.findOneAndUpdate({ user: userId }, subscriptionData, {
      session,
      upsert: true,
    });
    await Payment.create([paymentData], { session });

    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error verifying payment");
  } finally {
    session.endSession();
  }
};

const getAllSubscriptions = async (query: Record<string, any>) => {
  const searchableFields = ["name", "email"];
  const userQuery = new QueryBuilder(Subscription.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel.populate("user", "name email");
  return { data: result, meta };
};

const getSingleSubscription = async (id: string) => {
  const result = await Subscription.findById(id)
    .populate("user", "name email")
    .populate("plan", "name");
  return result;
};

const getMySubscription = async (id: string, web: boolean) => {
  if (web) {
    const result = await Subscription.find({ user: id, status: "active" });
    return result;
  } else {
    const result = await Subscription.findOne({
      user: id,
      status: "active",
      web,
    });
    const packageData = await PackageModel.findOne({
      package_name: result?.package_name,
    });
    return packageData;
  }
};

const subscriptionServices = {
  createOrUpdateSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  getMySubscription,
};

export default subscriptionServices;
