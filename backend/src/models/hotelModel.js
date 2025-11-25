const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: [true, "Phone number is required"],
  },
  address: {
    address1: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
  },
  pgType: {
    type: String,
    enum: ["Girls PG", "Boys PG", "Both"], // PG type field
    required: true,
  },
  bed: {
    type: String,
    default: "none",
  },
  price: {
    type: Number,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  wifi: {
    type: String,
    default: "No",
  },
  furnished: {
    type: String,
    default: "No",
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ["Pending", "Successful"], // Status field
    default: "Pending", // Default value
  },
});

// Create a geospatial index on the location field
hotelSchema.index({ location: "2dsphere" });

const Hotels = mongoose.model("Hotels", hotelSchema);

module.exports = Hotels;
