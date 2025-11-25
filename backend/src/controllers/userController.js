// /mnt/data/userController.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const { twilioClient, verifyServiceSid } = require("../config/twilioConfig");

// Send OTP (Demo)
const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ message: "Phone number is required" });
  }

  try {
    // DEMO: not integrating Twilio here
    // In production: send actual SMS via provider
    console.log(`[DEMO] OTP would be sent to ${phoneNumber}`);

    res.status(200).send({
      message: "OTP sent successfully (demo)",
      sid: "demo-sid-000000",
      // NOTE: for demo/testing you can choose to return a demo OTP like "000000"
      // otp: "000000"
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error sending OTP", error: error.message });
  }
};

// Verify OTP (Demo 000000)
const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res
      .status(400)
      .send({ message: "Phone number and OTP are required" });
  }

  try {
    // DEMO: accept "000000" as valid OTP
    if (code === "0000") {
      const user = await User.findOne({ phoneNumber });

      if (user) {
        const token = jwt.sign(
          { id: user._id, phoneNumber: user.phoneNumber },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        return res.status(200).send({
          message: "OTP verified successfully",
          token,
          userExists: true,
          user: {
            phoneNumber: user.phoneNumber,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        });
      } else {
        return res
          .status(200)
          .send({ message: "OTP verified successfully", userExists: false });
      }
    } else {
      return res.status(400).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error verifying OTP", error: error.message });
  }
};

// Complete Registration (now accepts name + email)
const completeRegistration = async (req, res) => {
  const { phoneNumber, name, email } = req.body;

  if (!phoneNumber || !name || !email) {
    return res
      .status(400)
      .send({ message: "Phone number, name and email are required" });
  }

  try {
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists. Login using OTP." });
    }

    // Optional: also check email uniqueness (model enforces unique if schema has unique: true)
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res
        .status(400)
        .send({ message: "Email already in use. Try logging in." });
    }

    const user = new User({ phoneNumber, name, email });
    await user.save();

    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).send({
      message: "User registered successfully",
      token,
      user: {
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error completing registration", error: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  completeRegistration,
};
