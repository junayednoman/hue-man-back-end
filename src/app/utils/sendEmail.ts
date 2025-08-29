import axios, { HttpStatusCode } from 'axios';
import { AppError } from '../classes/appError';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const emailData = {
      to,
      subject,
      html,
    };

    const res = await axios.post(
      'https://nodemailer-ecru-one.vercel.app',
      emailData,
    );
    const result = res?.data;
    if (!result.success) {
      throw new AppError(HttpStatusCode.BadRequest, result.message);
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(HttpStatusCode.BadRequest, 'Error sending email');
  }
};
