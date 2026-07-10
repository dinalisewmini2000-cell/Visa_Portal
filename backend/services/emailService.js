const nodemailer = require('nodemailer');

// We will use a mock transporter if credentials are not provided
// so the system doesn't crash during development
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass'
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.SMTP_USER) {
      console.log('--- EMAIL MOCK (No SMTP Configured) ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:\n${text}`);
      console.log('----------------------------------------');
      return;
    }

    await transporter.sendMail({
      from: `"Australia Visa Portal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

const sendReferenceNumberEmail = async (email, firstName, referenceNumber) => {
  const subject = "Your Visa Application Reference Number";
  const text = `Dear ${firstName},\n\nYour application has been received successfully.\nYour Reference Number is: ${referenceNumber}\n\nPlease keep this safe as you will need it to check your status or remove your application.\n\nRegards,\nAustralia Visa Portal`;
  await sendEmail(email, subject, text);
};

const sendVerificationCodeEmail = async (email, referenceNumber, code) => {
  const subject = "Application Removal Verification Code";
  const text = `You requested to remove your application (Ref: ${referenceNumber}).\n\nYour Verification Code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`;
  await sendEmail(email, subject, text);
};

const sendRemovalConfirmationEmail = async (email, referenceNumber) => {
  const subject = "Application Successfully Removed";
  const text = `Your application (Ref: ${referenceNumber}) has been successfully removed from our system.\n\nRegards,\nAustralia Visa Portal`;
  await sendEmail(email, subject, text);
};

module.exports = {
  sendReferenceNumberEmail,
  sendVerificationCodeEmail,
  sendRemovalConfirmationEmail
};
