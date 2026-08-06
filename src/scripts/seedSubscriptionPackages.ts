import mongoose from "mongoose";
import config from "../app/config";
import PackageModel from "../app/modules/packages/packages.model";

const packages = [
  {
    key: "essential",
    name: "Hue Essential",
    monthly_price: 5,
    yearly_price: 50,
    sub_user_limit: 5,
    is_active: true,
  },
  {
    key: "pro",
    name: "Hue Pro",
    monthly_price: 10,
    yearly_price: 100,
    sub_user_limit: 10,
    is_active: true,
  },
  {
    key: "collective",
    name: "Hue Collective",
    monthly_price: 15,
    yearly_price: 150,
    sub_user_limit: 15,
    is_active: true,
  },
] as const;

const seedSubscriptionPackages = async () => {
  if (!config.database_url) throw new Error("DATABASE_URL is required");
  await mongoose.connect(config.database_url);
  await PackageModel.bulkWrite(
    packages.map((packageItem) => ({
      updateOne: {
        filter: { key: packageItem.key },
        update: { $set: packageItem },
        upsert: true,
      },
    })),
  );
  await mongoose.disconnect();
};

seedSubscriptionPackages().catch(async (error) => {
  await mongoose.disconnect();
  throw error;
});
