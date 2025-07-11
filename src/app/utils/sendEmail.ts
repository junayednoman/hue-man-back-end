import nodemailer from 'nodemailer'
import config from '../config'
export const sendEmail = async (
  to: string[] | string,
  from?: string,
  subject?: string,
  html?: string,
  text?: string,
) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: true, // true for port 465, false for other ports
    auth: {
      user: config.sender_email,
      pass: config.sender_app_pass,
    },
    tls: {
      rejectUnauthorized: config.node_env === 'production', // Temporarily disable certificate validation (only for development)
    }
  })

  await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  })
}
