// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // <--- CHANGED THIS
      pass: process.env.EMAIL_PASS, // <--- CHANGED THIS
    },
  });

  const mailOptions = {
    from: `Routine App <${process.env.EMAIL_USER}>`, // <--- CHANGED THIS
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email Sent Successfully');
  } catch (err) {
    console.error('Email could not be sent:', err);
  }
};

module.exports = sendEmail;