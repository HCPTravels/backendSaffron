// otpMailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
const sendOTPEmail = async (recipientEmail, otp, recipientName = 'User', type = 'verification') => {
  try {
    const subject = type === 'reset' 
      ? 'Your Password Reset OTP Code'
      : 'Your OTP Verification Code';

    const heading = type === 'reset' 
      ? 'Password Reset OTP'
      : 'OTP Verification';

    const transporter = createTransporter();

    const mailOptions = {
      from: `"OTP Service" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">${heading}</h2>
          <p style="font-size: 16px; color: #555;">Hello ${recipientName},</p>
          <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
            <h1 style="color: #ff6523; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            This OTP is valid for 10 minutes. Please do not share this code with anyone.
          </p>
          
          <p style="font-size: 14px; color: #666;">
            If you didn't request this code, please ignore this email.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `,
      text: `Your OTP code is: ${otp}. This code is valid for 10 minutes. Do not share it.`
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send OTP'
    };
  }
};


module.exports = {
  createTransporter,
  sendOTPEmail
};