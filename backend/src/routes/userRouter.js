const express = require("express");
const { sendOtp, verifyOtp, completeRegistration } = require("../controllers/userController");

const userRoute = express.Router();

userRoute.post("/send-otp", sendOtp)
// ${API_URL}/api/v1/user/send-otp

userRoute.post("/verify", verifyOtp )
// ${API_URL}/api/v1/user/verify-otp

userRoute.post("/register", completeRegistration)
// ${API_URL}/api/v1/user/register



module.exports = userRoute