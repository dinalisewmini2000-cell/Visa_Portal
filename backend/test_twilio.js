require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhone) {
  console.error("Missing Twilio credentials in .env");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

// Replace with the user's verified number for testing
// I will pass this from the command line argument
const toPhone = process.argv[2];

if (!toPhone) {
  console.error("Please provide a destination phone number (e.g. +94769170884)");
  process.exit(1);
}

async function testSMS() {
  try {
    const message = await client.messages.create({
      body: 'Test message from Visa Portal backend!',
      from: twilioPhone,
      to: toPhone
    });
    console.log('SUCCESS! SMS sent. SID:', message.sid);
  } catch (error) {
    console.error('TWILIO ERROR:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
  }
}

testSMS();
