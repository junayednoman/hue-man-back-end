import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { Server } from "http";
import AdminModel from "./app/modules/admin/admin.model";
import bcrypt from "bcrypt";
import AuthModel from "./app/modules/auth/auth.model";

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log("🚀 Server is running on port: 5000");
    });
  } catch (error) {
    console.log("server error:", error);
  }
}

main();

// create default admin user
const createAdmin = async () => {
  const session = await mongoose.startSession();
  const email = "admin@gmail.com";
  try {
    session.startTransaction();
    const admin = await AdminModel.findOne({ email });
    const auth = await AuthModel.findOne({
      email,
      is_deleted: false,
      is_blocked: false,
    });
    if (admin && auth) {
      return;
    }

    const adminData = {
      name: "Admin",
      email,
    };

    const password = "admin";
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.salt_rounds)
    );

    await AuthModel.create(
      [{ email, password: hashedPassword, role: "admin" }],
      { session }
    );

    await AdminModel.create([adminData], { session });

    await session.commitTransaction();
    return console.log(`Admin account created`);
  } catch (err: any) {
    await session.abortTransaction();
    console.log(err.message || "Error creating admin account");
  } finally {
    session.endSession();
  }
};

createAdmin();

process.on("unhandledRejection", () => {
  console.log(`unhandledRejection is detected, server shutting down... 😞`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`uncaughtException is detected, server shutting down... 😞`);
  process.exit();
});
