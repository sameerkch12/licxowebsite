const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require('cors');
const connectDB = require("./src/config/db");
const connectCloudinary = require("./src/config/cloudinary");
const userRoute = require("./src/routes/userRouter");
const hotelRoute = require("./src/routes/hotelRouter");
const https = require('https');
const shortlistRoute = require("./src/routes/shortlistRoute");
const FeebackRoute= require("./src/routes/feedbackRoutes");



//configuration
dotenv.config();
connectCloudinary();
connectDB()

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all route
app.use(cors());

// Middleware to parse incoming requests
app.use(bodyParser.json());


// Routes
app.use("/api/v1/hotels", hotelRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/shortlist", shortlistRoute);
app.use("/api/feedback", FeebackRoute);






// Default route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// Keep the server awake on Render

setInterval(() => {
    https.get('https://licxowebsite.onrender.com/', (res) => {
      console.log(`Server hit with status code: ${res.statusCode}`);
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }, 3 * 60 * 1000); // Ping the server every 3 minutes (180000 ms)
