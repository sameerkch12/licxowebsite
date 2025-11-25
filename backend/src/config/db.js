const mongoose = require("mongoose");
require("dotenv").config()

const connectDB = async () => {
    const MONGOURL = process.env.MONGO_URL;
  try {
    await mongoose.connect(MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
