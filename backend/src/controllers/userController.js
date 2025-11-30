// /mnt/data/userController.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const { twilioClient, verifyServiceSid } = require("../config/twilioConfig");

// Send OTP (Demo)
const DEMO_OTP = "0000";

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // DEMO: not integrating Twilio here
    // In production: send actual SMS via provider
    console.log(`[DEMO] OTP (${DEMO_OTP}) would be sent to ${phoneNumber}`);

    res.status(200).json({
      message: "OTP sent successfully (demo)",
      sid: "demo-sid-000000",
      // NOTE: for demo/testing you can choose to return a demo OTP like "000000"
      // otp: DEMO_OTP
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Verify OTP (Demo 000000)
const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }

  try {
    // DEMO: accept DEMO_OTP as valid OTP
    if (code === DEMO_OTP) {
      const user = await User.findOne({ phoneNumber });

      if (user) {
        if (!process.env.JWT_SECRET) {
          console.error("Missing JWT_SECRET");
          return res.status(500).json({ message: "Server misconfiguration" });
        }

        const token = jwt.sign(
          {
            id: user._id,
            phoneNumber: user.phoneNumber,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        return res.status(200).json({
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
          .json({ message: "OTP verified successfully", userExists: false });
      }
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Complete Registration (now accepts name + email)
const completeRegistration = async (req, res) => {
  const { phoneNumber, name, email } = req.body;

  if (!phoneNumber || !name || !email) {
    return res
      .status(400)
      .json({ message: "Phone number, name and email are required" });
  }

  try {
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Login using OTP." });
    }

    // Optional: also check email uniqueness (model enforces unique if schema has unique: true)
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res
        .status(400)
        .json({ message: "Email already in use. Try logging in." });
    }

    const user = new User({ phoneNumber, name, email });
    await user.save();

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
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
    console.error("Error completing registration:", error);
    res
      .status(500)
      .json({ message: "Error completing registration" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  completeRegistration,
};
