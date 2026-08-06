import fs from "fs";
import mongoose from "mongoose";
import Stripe from "stripe";
import QueryBuilder from "../../classes/queryBuilder";
import { AppError } from "../../classes/appError";
import config from "../../config";
import { generateTransactionId } from "../../utils/transactionIdGenerator";
import { sendEmail } from "../../utils/sendEmail";
import AuthModel from "../auth/auth.model";
import PackageModel from "../packages/packages.model";
import { TBillingInterval } from "../packages/packages.interface";
import { PrintModel } from "../print/print.model";
import { printServices } from "../print/print.service";
import Subscription from "../subscription/subscription.model";
import Payment from "./payment.model";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2024-12-18.acacia",
});

type ProductAddress = {
  package_name: string;
  name: string;
  email: string;
  number: string;
  street_address: string;
  apartment: string;
  city: string;
  state: string;
  postal_code?: string;
  type?: "boy" | "girl";
};

type CreatePaymentPayload = {
  email: string;
  currency?: string;
  web?: boolean;
  package_id?: string;
  billing_interval?: TBillingInterval;
  package_name?: "single" | "bundle" | "combo";
  price?: number;
  address?: ProductAddress;
};

const createPaymentSession = async (payload: CreatePaymentPayload) => {
  const { email, web = false } = payload;
  const currency = (payload.currency || "usd").toLowerCase();
  const user = await AuthModel.findOne({ email }).populate("user", "name email");
  if (!user) throw new AppError(401, "Unauthorized");

  if (payload.package_id && payload.billing_interval) {
    const packageItem = await PackageModel.findOne({
      _id: payload.package_id,
      is_active: true,
    });
    if (!packageItem) throw new AppError(404, "Active package not found");

    const price = payload.billing_interval === "monthly"
      ? packageItem.monthly_price
      : packageItem.yearly_price;
    const transactionId = generateTransactionId();
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency,
          product_data: { name: `${packageItem.name} (${payload.billing_interval})` },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: email,
      metadata: {
        type: "subscription",
        transaction_id: transactionId,
        user_id: String(user._id),
        package_id: String(packageItem._id),
        billing_interval: payload.billing_interval,
        expected_amount: String(Math.round(price * 100)),
        web: String(web),
      },
      success_url: `${config.payment_success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: config.payment_cancel_url || config.portia_payment_cancel_url,
    });
    return { url: checkoutSession.url };
  }

  const packageName = payload.package_name;
  if (!packageName || !payload.price) throw new AppError(400, "Invalid payment request");
  const address = payload.address;
  if (address) {
    address.name = (user.user as any).name;
    address.email = user.email;
    address.package_name = packageName === "bundle"
      ? "AAC Core Board Lanyards (Bundle (Boy & Girl): $45)"
      : "AAC Core Board Lanyards (Price: $25 each)";
  }
  const transactionId = generateTransactionId();
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency,
        product_data: { name: packageName },
        unit_amount: Math.ceil(payload.price * 100),
      },
      quantity: 1,
    }],
    mode: "payment",
    customer_email: email,
    metadata: {
      type: "product",
      transaction_id: transactionId,
      user_id: String(user._id),
      package_name: packageName,
      address: JSON.stringify(address || {}),
    },
    success_url: `${config.payment_success_url}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: config.payment_cancel_url || config.portia_payment_cancel_url,
  });
  return { url: checkoutSession.url };
};

const paymentCallback = async (query: Record<string, any>) => {
  const { session_id: sessionId } = query;
  if (!sessionId) throw new AppError(400, "Session id is required");

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  if (checkoutSession.payment_status !== "paid") throw new AppError(400, "Payment failed!");

  const existingPayment = await Payment.findOne({ checkout_session_id: sessionId });
  const web = checkoutSession.metadata?.web === "true";
  if (existingPayment) return { success: true, web };

  if (checkoutSession.metadata?.type !== "subscription") {
    return handleProductPayment(checkoutSession);
  }

  const metadata = checkoutSession.metadata;
  const userId = metadata.user_id;
  const packageId = metadata.package_id;
  const billingInterval = metadata.billing_interval as TBillingInterval;
  if (!userId || !packageId || !["monthly", "yearly"].includes(billingInterval)) {
    throw new AppError(400, "Invalid payment metadata");
  }

  const packageItem = await PackageModel.findById(packageId);
  if (!packageItem) throw new AppError(404, "Package not found");
  const expectedAmountInCents = Number(metadata.expected_amount);
  if (!Number.isInteger(expectedAmountInCents) || checkoutSession.amount_total !== expectedAmountInCents) {
    throw new AppError(400, "Paid amount does not match package price");
  }
  const pricePaid = expectedAmountInCents / 100;

  const now = new Date();
  const existingSubscription = await Subscription.findOne({ user: userId, web });
  const renewalBase = existingSubscription?.end_date && existingSubscription.end_date > now
    ? existingSubscription.end_date
    : now;
  const endDate = new Date(renewalBase);
  endDate.setMonth(endDate.getMonth() + (billingInterval === "monthly" ? 1 : 12));

  const mongoSession = await mongoose.startSession();
  try {
    mongoSession.startTransaction();
    await Payment.create([{
      user: userId,
      amount: pricePaid,
      transaction_id: metadata.transaction_id,
      checkout_session_id: sessionId,
      status: "paid",
      currency: checkoutSession.currency || "usd",
    }], { session: mongoSession });
    await Subscription.findOneAndUpdate(
      { user: userId, web },
      {
        user: userId,
        package: packageItem._id,
        package_key: packageItem.key,
        billing_interval: billingInterval,
        price_paid: pricePaid,
        currency: checkoutSession.currency || "usd",
        start_date: now,
        end_date: endDate,
        status: "active",
        web,
      },
      { session: mongoSession, upsert: true, new: true, setDefaultsOnInsert: true },
    );
    await mongoSession.commitTransaction();
  } catch (error: any) {
    if (mongoSession.inTransaction()) await mongoSession.abortTransaction();
    if (error?.code === 11000) return { success: true, web };
    throw new AppError(500, error.message || "Error verifying payment");
  } finally {
    mongoSession.endSession();
  }

  if (web) {
    const auth = await AuthModel.findById(userId);
    const prints = await PrintModel.findOne({ user: userId });
    if (prints) await PrintModel.updateMany({ user: userId }, { print_count: 0 });
    else if (auth) await printServices.createPrints(auth.email);
  }
  return { message: "Payment successful", success: true, web };
};

const handleProductPayment = async (
  checkoutSession: Stripe.Checkout.Session,
) => {
  const userId = checkoutSession.metadata?.user_id;
  const packageName = checkoutSession.metadata?.package_name;
  if (!userId) throw new AppError(400, "Invalid product payment metadata");
  const parsedAddress = JSON.parse(checkoutSession.metadata?.address || "{}");
  await Payment.create({
    user: userId,
    amount: (checkoutSession.amount_total || 0) / 100,
    transaction_id: checkoutSession.metadata?.transaction_id,
    checkout_session_id: checkoutSession.id,
    status: "paid",
    currency: checkoutSession.currency || "usd",
  });
  if (packageName === "bundle" || packageName === "single") {
    const data = await fs.promises.readFile("./src/app/templates/shippingAddress.html", "utf8");
    const emailContent = data
      .replace("{{package_name}}", parsedAddress.package_name || "N/A")
      .replace("{{customer_name}}", parsedAddress.name || "N/A")
      .replace("{{customer_email}}", parsedAddress.email || "N/A")
      .replace(/{{customer_phone}}|{{number}}/g, parsedAddress.number || "N/A")
      .replace("{{street_address}}", parsedAddress.street_address || "N/A")
      .replace("{{apartment}}", parsedAddress.apartment || "N/A")
      .replace("{{type}}", parsedAddress.type || "N/A")
      .replace("{{city}}", parsedAddress.city || "N/A")
      .replace("{{state}}", parsedAddress.state || "N/A")
      .replace("{{postal_code}}", parsedAddress.postal_code || "N/A");
    await sendEmail(config.admin_email as string, "New Order Placed – AAC Core Board Lanyards", emailContent);
  }
  return { message: "Payment successful", success: true, web: false };
};

const getAllPayments = async (query: Record<string, any>) => {
  const userQuery = new QueryBuilder(Payment.find(), query)
    .search(["amount", "status", "transaction_id"])
    .filter()
    .sort()
    .paginate()
    .selectFields();
  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel.populate("user", "name email");
  return { data: result, meta };
};

const getSinglePayment = async (
  id: string,
  requester: { id: string; role: string },
) => {
  const filter = requester.role === "admin" ? { _id: id } : { _id: id, user: requester.id };
  const result = await Payment.findOne(filter).populate("user", "name email");
  if (!result) throw new AppError(404, "Payment not found");
  return result;
};

const paymentSessionForPortia = async (
  price: number,
  payload: { name: string; email: string; company: string; phone: string; address: string; quantity: number },
) => {
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "Portia Pro User" },
        unit_amount: Math.ceil(price * 100),
      },
      quantity: 1,
    }],
    mode: "payment",
    customer_email: payload.email,
    success_url: `${config.portia_payment_callback}?session_id={CHECKOUT_SESSION_ID}&name=${encodeURIComponent(payload.name)}&email=${encodeURIComponent(payload.email)}&company=${encodeURIComponent(payload.company)}&phone=${encodeURIComponent(payload.phone)}&address=${encodeURIComponent(payload.address)}&quantity=${payload.quantity}`,
    cancel_url: config.portia_payment_cancel_url,
  });
  return { url: checkoutSession.url };
};

const portiaProPaymentCallback = async (query: Record<string, any>) => {
  const { session_id, name, email, company, phone, address, quantity } = query;
  const paymentSession = await stripe.checkout.sessions.retrieve(session_id);
  if (paymentSession.payment_status !== "paid") throw new AppError(400, "Payment failed!");
  const subject = `Portia Pro New User Payment Received - ${name}`;
  const htmlMarkup = `<p>Hi Rashida,</p><p>A new payment has been received on <strong>Portia Pro</strong>.</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Email:</strong> ${email}</li><li><strong>Company:</strong> ${company}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Address:</strong> ${address}</li><li><strong>Quantity:</strong> ${quantity}</li></ul>`;
  await sendEmail(config.admin_email as string, subject, htmlMarkup);
};

export const paymentServices = {
  createPaymentSession,
  getAllPayments,
  getSinglePayment,
  paymentCallback,
  paymentSessionForPortia,
  portiaProPaymentCallback,
};
