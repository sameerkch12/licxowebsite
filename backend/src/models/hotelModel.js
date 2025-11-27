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
    // FIXED: Frontend (AddRoom.tsx) से आ रहे मानों (boys/girls/co) से मेल खाने के लिए enum को बदला गया।
    enum: ["boys", "girls", "co"], 
    required: true,
  },
  bed: {
    type: String,
    // FIXED: Frontend से आ रहे मानों (single/double) को शामिल करने के लिए enum को बदला गया।
    enum: ["single", "double", "none"],
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
    // `wifi` और `furnished` के लिए "yes"/"no" इनपुट के लिए तैयार
    default: "No",
  },
  furnished: {
    type: String,
    // `furnished` के लिए "furnished"/"semi"/"unfurnished" इनपुट के लिए तैयार
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
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Successful"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Geo-spatial queries को सक्षम करने के लिए index बनाना
hotelSchema.index({ location: "2dsphere" });

const Hotels = mongoose.model("Hotels", hotelSchema);

module.exports = Hotels;