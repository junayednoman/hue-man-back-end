import config from "../../config";
import { sendEmail } from "../../utils/sendEmail";
import { TApplication } from "./application.interface";
import ApplicationModel from "./application.model";

const createApplication = async (payload: TApplication) => {
  const result = await ApplicationModel.create(payload)

  // Compose email content (HTML or plain text)
  const htmlContent = `
    <h2>New Application Received</h2>
    <p><strong>Full Name:</strong> ${payload.full_name}</p>
    <p><strong>Email:</strong> ${payload.email_address}</p>
    <p><strong>About Yourself:</strong> ${payload.about_yourself}</p>
    <p><strong>Promotion Methods:</strong></p>
    <ul>
      <li>Social Media: ${payload.promotion_methods.social_media ? 'Yes' : 'No'}</li>
      <li>Blogs/Newsletters: ${payload.promotion_methods.blogs_or_newsletters ? 'Yes' : 'No'}</li>
      <li>Professional Events: ${payload.promotion_methods.professional_events ? 'Yes' : 'No'}</li>
      <li>Other: ${payload.promotion_methods.other || 'N/A'}</li>
    </ul>
    <p><strong>Payout Method:</strong> ${payload.payout_method}</p>
    <p><strong>Currently Using Hue Man:</strong> ${payload.currently_using_hue_man ? 'Yes' : 'No'}</p>
  `

  // Send email to admin
  await sendEmail(
    config.sender_email as string,
    config.sender_email as string,
    'New Application Received - Hue Man',
    htmlContent,
    undefined
  )

  return result
}
const getApplications = async () => {
  const result = await ApplicationModel.find({});
  return result;
}

const getApplication = async (id: string) => {
  const result = await ApplicationModel.findById(id);
  return result;
}

const applicationServices = {
  createApplication,
  getApplications,
  getApplication
}

export default applicationServices;