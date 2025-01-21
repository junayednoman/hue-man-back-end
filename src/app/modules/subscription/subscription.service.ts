import config from '../../config';
import { AppError } from '../../classes/appError';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import isUserExist from '../../utils/isUserExist';
import { PaymentModel, SubscriptionModel } from './subscription.model';
import { generateTransactionId } from '../../utils/transactionIdGenerator';
import QueryBuilder from '../../classes/queryBuilder';
import UserModel from '../user/user.model';

// Initialize the Stripe client
const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2024-12-18.acacia', // Used the latest API version
});

export const manageSubscriptions = async (body: any, signature: any) => {
  let event = body;
  const endpointSecret = config.stripe_webhook_secret_key;
  // Verify the webhook signature
  if (endpointSecret) {
    // const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
      throw new AppError(500, err.message);
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const eventData = event.data?.object;
    if (!eventData) {
      throw new AppError(400, 'Invalid event data');
    }
    // Handle events
    switch (event.type) {
      case 'checkout.session.completed': {
        // Subscription created through Stripe Checkout
        const checkoutSession = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSession.subscription,
        );
        const auth = await isUserExist(checkoutSession.customer_details.email);

        const isSubscriptionExists = await SubscriptionModel.findOne({
          auth: auth._id,
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const interval = subscription.plan.interval;

        const start_date = new Date();
        let end_date;

        // Calculate the end date based on the interval
        if (interval === 'month') {
          end_date = new Date(start_date);
          end_date.setMonth(start_date.getMonth() + 1);
        } else if (interval === 'year') {
          end_date = new Date(start_date);
          end_date.setFullYear(start_date.getFullYear() + 1);
        }

        const subscriptionInfo = {
          user: auth._id,
          package_name: interval === 'month' ? 'monthly' : 'yearly',
          start_date,
          stripe_subscription_id: checkoutSession.subscription,
          end_date,
          status: 'active',
        };

        // Update the user's subscription if subscription already exists
        if (isSubscriptionExists) {
          return await SubscriptionModel.findOneAndUpdate(
            { user: auth._id },
            subscriptionInfo,
            { new: true, session },
          );
        }

        // Create a new subscription does not already exists
        await SubscriptionModel.create([subscriptionInfo], { session });
        // await handleCheckoutSessionCompleted(checkoutSession, session);
        break;
      }

      // Subscription upgraded or downgraded
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const subscriptionToUpdate = await SubscriptionModel.findOne({
          stripe_subscription_id: subscription.id,
        });

        if (
          subscriptionToUpdate?.status === 'canceled' &&
          subscription.status === 'active'
        ) {
          await SubscriptionModel.findOneAndUpdate(
            { stripe_subscription_id: subscription.id },
            { status: subscription.status },
            { new: true, session },
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription canceled or ended
        const subscription = event.data.object;
        const subscriptionToUpdate = await SubscriptionModel.findOne({
          stripe_subscription_id: subscription.id,
        });

        if (subscriptionToUpdate) {
          await SubscriptionModel.findOneAndUpdate(
            { stripe_subscription_id: subscription.id },
            { status: subscription.status },
            { new: true, session },
          );
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        // Payment for a subscription succeeded
        const invoice = event.data.object;
        if (!invoice) {
          throw new AppError(404, 'Invoice not found');
        }

        const auth = await isUserExist(invoice.customer_email);
        if (!auth) {
          throw new AppError(400, 'User not found');
        }

        const user = await UserModel.findOne({ email: auth.email });
        if (!user) {
          throw new AppError(404, 'User not found');
        }

        // Create a new payment record
        const transaction_id = generateTransactionId();

        const paymentInfo = {
          stripe_invoice_id: invoice.id,
          user: user._id,
          transaction_id,
          amount: invoice.amount_paid / 100,
          payment_date: new Date(),
          payment_status: invoice.status,
          currency: invoice.currency,
        };

        await PaymentModel.create([paymentInfo], { session });

        // update subscription status if this is auto renewal of subscription
        const billingReason = invoice.billing_reason;
        if (billingReason === 'subscription_cycle') {
          const isSubscriptionExists = await SubscriptionModel.findOne({
            auth: auth._id,
          });

          const package_name = isSubscriptionExists?.package_name;

          const start_date = new Date();
          let end_date;

          // Calculate the end date based on the interval
          if (package_name === 'monthly') {
            end_date = new Date(start_date);
            end_date.setMonth(start_date.getMonth() + 1);
          } else if (package_name === 'yearly') {
            end_date = new Date(start_date);
            end_date.setFullYear(start_date.getFullYear() + 1);
          }

          const subscriptionInfo = {
            start_date,
            end_date,
            status: 'active',
          };

          await SubscriptionModel.findOneAndUpdate(
            { user: auth._id },
            subscriptionInfo,
            { new: true, session },
          );
        }
        break;
      }
    }

    // Commit transaction
    await session.commitTransaction();
  } catch (err: any) {
    console.error(`❌ Error handling event: ${err.message}`);
    await session.abortTransaction();
    throw new AppError(500, err.message || 'Error handling event');
  } finally {
    session.endSession();
  }
};

export const subscriptionServices = {
  manageSubscriptions
};

// payment services
const getPayments = async (query: Record<string, any>) => {
  const populatedFields = query.populatedFields?.split(',')?.join(' ');
  const paymentQuery = new QueryBuilder(
    PaymentModel.find().populate('athlete', populatedFields && populatedFields),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await paymentQuery.countTotal();
  const result = await paymentQuery.queryModel;
  return { data: result, meta };
};

const getSinglePayment = async (id: string) => {
  const payment = await PaymentModel.findById(id).populate('athlete');
  return payment;
};
export const paymentServices = { getPayments, getSinglePayment };
