import 'dotenv/config';
import nodemailer from 'nodemailer';

const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  service: 'Gmail',
  host: 'smtp.gmail.com',
  // 465 means SMTP - simple mail transfer protocol
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: GMAIL_EMAIL };
  await transporter.sendMail(email);
};

export { sendEmail };
