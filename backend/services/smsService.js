const twilio = require('twilio');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendSMS = async (to, body) => {
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn(`\n[SMS SIMULATION] SMS would have been sent to ${to}:`);
    console.warn(`[SMS SIMULATION] Message: "${body}"\n`);
    console.warn('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER not set in .env. Skipping real SMS sending.\n');
    return;
  }
  
  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log('SMS sent successfully. SID:', message.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

const sendReferenceNumberSMS = async (mobileNumber, name, refNumber) => {
  // Ensure the number is formatted for Twilio (e.g., requires +countrycode). 
  // If user inputs 0712345678, in Sri Lanka it should ideally be +94712345678.
  // For safety with raw inputs, we send it as is, but you may need to format it depending on your Twilio setup.
  const formattedNumber = mobileNumber.startsWith('0') ? '+94' + mobileNumber.substring(1) : mobileNumber;
  
  const text = `Hello ${name}, your application is submitted. Reference number: ${refNumber}. Keep this safe! - Visa Portal`;
  await sendSMS(formattedNumber, text);
};

const sendVerificationCodeSMS = async (mobileNumber, refNumber, code) => {
  const formattedNumber = mobileNumber.startsWith('0') ? '+94' + mobileNumber.substring(1) : mobileNumber;
  
  const text = `Verification code for app removal (${refNumber}): ${code}. Expires in 10 mins.`;
  await sendSMS(formattedNumber, text);
};

const sendRemovalConfirmationSMS = async (mobileNumber, refNumber) => {
  const formattedNumber = mobileNumber.startsWith('0') ? '+94' + mobileNumber.substring(1) : mobileNumber;
  
  const text = `Your application (${refNumber}) has been successfully removed. - Visa Portal`;
  await sendSMS(formattedNumber, text);
};

module.exports = {
  sendReferenceNumberSMS,
  sendVerificationCodeSMS,
  sendRemovalConfirmationSMS
};
