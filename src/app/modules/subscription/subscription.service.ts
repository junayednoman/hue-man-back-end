import mongoose, { ObjectId } from "mongoose";
import { SubscriptionModel } from "./subscription.model";
import { PaymentModel } from "../payment/payment.model";
import UserModel from "../user/user.model";
import { generateTransactionId } from "../../utils/transactionIdGenerator";

const createOrUpdateSubscription = async (email: string, payload: { package_name: 'monthly' | 'yearly', amount: number }) => {
  const session = await mongoose.startSession();

  const user = await UserModel.findOne({ email, is_blocked: false, is_deleted: false });

  if (!user) throw new Error('User not found');

  // prepare payment data
  const transaction_id = generateTransactionId();
  const paymentData = {
    user: user?._id as unknown as ObjectId,
    amount: payload.amount,
    payment_date: new Date(),
    transaction_id,
  };

  const subscriptionData = {
    user: user?._id as unknown as ObjectId,
    package_name: payload.package_name,
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + (payload.package_name === 'monthly' ? 1 : 12))),
    remaining_messages: 100,
  };

  const subscription = await SubscriptionModel.findOne({ user: user?._id });

  try {
   session.startTransaction();

    if (subscription) {
      subscriptionData.remaining_messages = subscription.remaining_messages + 100;
      await SubscriptionModel.findByIdAndUpdate(subscription._id, subscriptionData, { session });
    }

    await PaymentModel.create([paymentData], { session });

    await session.commitTransaction();
    return result;
  }
  catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession()
  }
}


export const subscriptionServices = {
  createOrUpdateSubscription,
}