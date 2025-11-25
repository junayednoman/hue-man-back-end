import { AppError } from "../../classes/appError";
import { sendEmail } from "../../utils/sendEmail";
import UserModel from "../user/user.model";
import config from "../../config";
import { TSupportMessage } from "./support.interface";
import SupportMessageModel from "./support.model";
import fs from "fs";

const sendSupportMessage = async (payload: TSupportMessage) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (!user) return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  payload.user = user._id;
  const emailTemplatePath = "./src/app/templates/supportMessage.html";

  fs.readFile(emailTemplatePath, "utf8", (err, data) => {
    if (err) throw new AppError(500, err.message || "Something went wrong");
    const emailContent = data
      .replace('{{full_name}}', user?.name)
      .replace('{{email_address}}', payload?.email)
      .replace('{{subject}}', payload.subject)
      .replace('{{message}}', payload.message);

    sendEmail(config.admin_email as string, payload.subject, emailContent);
  })
  const result = await SupportMessageModel.create(payload);
  return result;
};

const geTSupportMessageMessages = async () => {
  const result = await SupportMessageModel.find();
  return result;
};

const getSingleSupportMessage = async (id: string) => {
  const result = await SupportMessageModel.findById(id);
  return result;
};

const supportServices = {
  sendSupportMessage,
  geTSupportMessageMessages,
  getSingleSupportMessage
}

export default supportServices;
