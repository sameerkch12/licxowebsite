const cloudinary = require("cloudinary").v2;
require("dotenv").config()

// Cloudinary configuration
const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: "dbwdkpovl" || process.env.CLOUD_NAME,
    api_key: "424975841827633" || process.env.API_KEY ,
    api_secret: "Awbs7DbD_lfjbNtUsuKNfpI9-4A" || process.env.API_SECRET,
    timeout: 60000,
  });
};


module.exports = connectCloudinary