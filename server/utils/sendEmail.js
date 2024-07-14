import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { hashString } from './index.js';
import Verifications from '../models/EmailVerification.js';
import PasswordReset from '../models/PasswordReset.js';
//import PasswordReset from '../models/passwordReset.js';

dotenv.config();
const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendVerificationEmail = async (customer, res) => {
  const { _id, email, username } = customer;
  const token = _id + uuidv4();
  const link = APP_URL + '/customers/verify/' + _id + '/' + token;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: 'Email Verification',
    html: `<div
      style = 'font-family: Arial, sans-serif; font-size: 20px;background-color:white' >
        <h1> Please verify your email address</h1>
        <hr/>
        <h4>Hi ${username}</h4>
        <h4>Thanks to register to our website.</h4>
        <p>
          Please verify your email address so we can know that it's really you.
          <br>
          <p>This link <b>expires in 1 hour</b></p>
          <br>
          <a href = ${link} 
          style = 'color:#fff; padding:14px; text-decoration: none; background-color: #000'>Email Address</a>
        </p>
        <div style = 'margin-top: 20px;'>
          <h5>Best Regards</h5>
          <h5>Smart Vision Team</h5>
        </div>
      </div>`,
  };
  try {
    const hashedToken = await hashString(token);
    const newVerifiedEmail = await Verifications.create({
      customerId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    if (newVerifiedEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: 'PENDING',
            message:
              'Verification email has been sent to your account. Check your email for further instructions.',
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(404).json({ message: 'something went wrong' });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'something went wrong' });
  }
};

export const resetPasswordLink = async (customer, res) => {
  const { _id, email } = customer;
  const token = _id + uuidv4();
  const link = APP_URL + '/customers/reset-password/' + _id + '/' + token;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: 'Password Reset',
    html: `
      <p style ="font-family:Arial,sans-serif; font-size: 20px; color: #333; background-color:white">
        Password reset link.Please click the link below to reset password.
        <br>
        <p style='font-size:18px'><b>This Link expires in 10 minutes</b></p>
        <a href = ${link}
        style = 'color:#fff; padding:14px; text-decoration: none; background-color: #000'
        >Reset Password</a>
      </p>
    `,
  };
  try {
    const hashedToken = await hashString(token);
    const resetEmail = await PasswordReset.create({
      customerId: _id,
      email,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });
    if (resetEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: 'PENDING',
            message: 'Reset Password link has been sent to your account.',
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: 'Something went wrong' });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Something went wrong' });
  }
};
