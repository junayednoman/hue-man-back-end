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
import { PrintModel } from "../print/print.model";
import { sendEmail } from "../../utils/sendEmail";
import fs from "fs";

// Initialize the Stripe client
const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2024-12-18.acacia",
});

const createPaymentSession = async (
  package_name: "monthly" | "yearly" | "single" | "bundle" | "combo",
  email: string,
  currency: string,
  price: number,
  web = false,
  address?: {
    package_name: string;
    name: string;
    email: string;
    number: string;
    street_address: string;
    area: string;
    city: string;
    state: string;
    postal_code?: string;
  }
) => {
  const user = await AuthModel.findOne({ email }).populate(
    "user",
    "name email"
  );
  if (!user) throw new AppError(401, "Unauthorized");
  if (address) {
    address.name = (user.user as any).name;
    address.email = user.email;
    const name =
      package_name === "bundle"
        ? "AAC Core Board Lanyards (Bundle (Boy & Girl): $45)"
        : package_name === "single" &&
          "AAC Core Board Lanyards (Price: $25 eac)";
    address.package_name = name as string;
  }

  const transaction_id = generateTransactionId();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `Subscribe to ${package_name?.replace(/^\w/, (c) =>
              c.toUpperCase()
            )} plan`,
          },
          unit_amount: Math.ceil(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: email,
    success_url: `${
      config.payment_success_url
    }?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transaction_id}&duration=${
      package_name === "monthly" ? 1 : 12
    }&userId=${
      user?._id
    }&web=${web}&email=${email}&package_name=${package_name}&address=${encodeURIComponent(
      JSON.stringify(address)
    )}`,
    cancel_url: config.portia_payment_cancel_url,
  });

  return { url: session.url };
};

const paymentCallback = async (query: Record<string, any>) => {
  const {
    session_id,
    transaction_id,
    duration,
    userId,
    web,
    email,
    package_name,
    address: addressStr,
  } = query;

  let parsedAddress: any = {};
  if (package_name !== "combo" && addressStr) {
    parsedAddress = JSON.parse(decodeURIComponent(addressStr));
  }

  const paymentSession = await stripe.checkout.sessions.retrieve(session_id);
  const isPaymentExist = await Payment.findOne({ transaction_id });

  if (isPaymentExist) {
    return { web: web === "true" ? true : false };
  }

  const session = await mongoose.startSession();

  if (paymentSession.payment_status === "paid") {
    if (web === "true") {
      const prints = await PrintModel.findOne({ user: userId });
      if (prints) {
        await PrintModel.updateMany({ user: userId }, { print_count: 0 });
      } else {
        await printServices.createPrints(email);
      }
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

    const subscription = await Subscription.findOne({
      user: userId,
      web: web === "true" ? true : false,
    });

    if (web === "false" && subscription) {
      const previous_end_date = subscription.end_date;
      if (previous_end_date && !isNaN(previous_end_date.getTime())) {
        const monthsRemaining = Math.max(
          0,
          (previous_end_date.getFullYear() - start_date.getFullYear()) * 12 +
            previous_end_date.getMonth() -
            start_date.getMonth()
        );
        end_date = new Date(start_date);
        end_date.setMonth(
          start_date.getMonth() + monthsRemaining + Number(duration)
        );
      }
    }

    const subscriptionData = {
      user: userId,
      start_date,
      end_date,
      status: "active",
      package_name,
    };

    try {
      await Payment.create([paymentData], { session });
      if (web) {
        await Subscription.create([subscriptionData], { session });
      } else {
        await Subscription.findOneAndUpdate(
          { user: userId, web: web === "true" ? true : false },
          subscriptionData,
          { session, upsert: true }
        );
      }

      await session.commitTransaction();

      // send email to admin
      if (package_name === "bundle" || package_name === "single") {
        const emailTemplatePath = "./src/app/templates/shippingAddress.html";

        fs.readFile(emailTemplatePath, "utf8", (err, data) => {
          if (err)
            throw new AppError(500, err.message || "Something went wrong");

          const emailContent = data
            .replace("{{package_name}}", parsedAddress.package_name || "N/A")
            .replace("{{customer_name}}", parsedAddress.name || "N/A")
            .replace("{{customer_email}}", parsedAddress.email || "N/A")
            .replace("{{customer_phone}}", parsedAddress.number || "N/A")
            .replace("{{number}}", parsedAddress.number || "N/A")
            .replace(
              "{{street_address}}",
              parsedAddress.street_address || "N/A"
            )
            .replace("{{area}}", parsedAddress.area || "N/A")
            .replace("{{city}}", parsedAddress.city || "N/A")
            .replace("{{state}}", parsedAddress.state || "N/A")
            .replace("{{postal_code}}", parsedAddress.postal_code || "N/A");

          sendEmail(
            "config.admin_email as string",
            "New Order Placed – AAC Core Board Lanyards",
            emailContent
          );
        });
      }
      return {
        message: "Payment successful",
        success: true,
        web: web === "true" ? true : false,
      };
    } catch (error: any) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw new AppError(500, error.message || "Error verifying payment");
    } finally {
      session.endSession();
    }
  } else throw new AppError(400, "Payment failed!");
};

const getAllPayments = async (query: Record<string, any>) => {
  const searchableFields = ["amount", "status", "transaction_id"];
  const userQuery = new QueryBuilder(Payment.find(), query)
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
  const result = await Payment.findOne({ _id: id }).populate(
    "user",
    "name email"
  );
  return result;
};

const paymentSessionForPortia = async (
  price: number,
  payload: {
    name: string;
    email: string;
    company: string;
    phone: string;
    address: string;
    quantity: number;
  }
) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Portia Pro User`,
          },
          unit_amount: Math.ceil(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: payload.email,
    success_url: `${config.portia_payment_callback}?session_id={CHECKOUT_SESSION_ID}&name=${payload.name}&email=${payload.email}&company=${payload.company}&phone=${payload.phone}&address=${payload.address}&quantity=${payload.quantity}`,
    cancel_url: config.portia_payment_cancel_url,
  });

  return { url: session.url };
};

const portiaProPaymentCallback = async (query: Record<string, any>) => {
  const { session_id, name, email, company, phone, address, quantity } = query;
  const paymentSession = await stripe.checkout.sessions.retrieve(session_id);
  if (paymentSession.payment_status === "paid") {
    const subject = `Portia Pro New User Payment Received - ${name}`;
    const html_markup = `<p>Hi Rashida,</p>
  <p>A new payment has been received on <strong>Portia Pro</strong>. Here are the details:</p>

  <h3 style="color: #2e6c80;">User Information</h3>
  <ul>
    <li><strong>Name:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Company:</strong> ${company}</li>
    <li><strong>Phone:</strong> ${phone}</li>
    <li><strong>Address:</strong> ${address}</li>
    <li><strong>Quantity:</strong> ${quantity}</li>
  </ul>

  <p>Please review this payment in your dashboard and proceed with the necessary steps.</p>

  <p>Thanks,</p>
  <p><strong>Portia Pro System</strong></p>`;

    sendEmail(config.admin_email as string, subject, html_markup);
  } else throw new AppError(400, "Payment failed!");
};

export const paymentServices = {
  createPaymentSession,
  getAllPayments,
  getSinglePayment,
  paymentCallback,
  paymentSessionForPortia,
  portiaProPaymentCallback,
};
