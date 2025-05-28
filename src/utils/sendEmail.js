import nodemailer from 'nodemailer';

import 'dotenv/config';
import { getEnvVar } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMPT_HOST'),
  port: Number(getEnvVar('SMPT_PORT')),
  auth: {
    user: getEnvVar('SMPT_USER'),
    pass: getEnvVar('SMPT_PASSWORD'),
  },
});

export const sendEmail = async (option) => {
  return await transporter.sendMail(option);
};