const twilio = require("twilio");
require("dotenv").config()

// Retrieve environment variables
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN ;
const verifyServiceSid = process.env.VERIFY_SERVICE_SID; 

// Check for missing values
if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Missing Twilio configuration in environment variables.");
}

// Initialize Twilio client
const twilioClient = twilio(accountSid, authToken);

module.exports = {
  twilioClient,
  verifyServiceSid,
};
