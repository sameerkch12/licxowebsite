const Hotels = require("../models/hotelModel");
const hotelService = require("../services/hotelService");

// ✅ Create a new hotel
const createHotel = async (req, res) => {
  try {
    const { body, files } = req;

    // Data Sanitization and Normalization
    const furnishedValue = body.furnished?.trim().toLowerCase() || "no";
    const wifiValue = body.wifi?.trim().toLowerCase() || "no";
    const bedValue = body.bed?.trim().toLowerCase() || "none";
    
    // Ensure coordinates are correctly parsed as numbers.
    const longitude = parseFloat(body.longitude);
    const latitude = parseFloat(body.latitude);

    // Basic check for coordinates (optional but recommended)
    if (isNaN(longitude) || isNaN(latitude)) {
        return res.status(400).json({ 
            error: "Invalid coordinates", 
            message: "Longitude and Latitude must be valid numbers." 
        });
    }

    // Prepare hotel data
    const hotelData = {
      name: body.name,
      phone: body.phone,
      price: body.price,
      room: body.room,
      // FIXED: pgType अब सीधे frontend से आ रहे enum value (boys/girls/co) का उपयोग करता है
      pgType: body.pgType, 
      address: {
        address1: body.address1,
        district: body.district,
        state: body.state,
      },
      // FIXED: bed, wifi, furnished को trim और lowercase करके मॉडल के enum से मिलाया गया
      bed: bedValue, 
      wifi: wifiValue,
      furnished: furnishedValue,
      location: {
        type: "Point",
        // GeoJSON standard: [longitude, latitude]
        coordinates: [longitude, latitude],
      },
      status: "Pending", 
    };

    // Call service to upload images and create hotel entry
    const newHotel = await hotelService.createHotel(hotelData, files);
    
    res.status(201).json({ msg: "Hotel created successfully", success: true, data: newHotel });
  } catch (error) {
    console.error("Error creating hotel:", error.message);
    
    // Mongoose validation errors often contain specific messages
    if (error.name === 'ValidationError') {
        // Return a 400 Bad Request for validation errors
        return res.status(400).json({ error: "Validation Failed", details: error.message });
    }

    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


// ✅ Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get one hotel by phone
const getOneHotel = async (req, res) => {
  const { phone } = req.params;
  try {
    const hotel = await hotelService.getOneHotelByPhone(phone);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update hotel by phone
const updateHotel = async (req, res) => {
  const { phone } = req.params;
  try {
    const updatedData = {
      ...req.body,
      // Ensure consistency by trimming and lowercasing
      furnished: req.body.furnished?.trim().toLowerCase(),
      wifi: req.body.wifi?.trim().toLowerCase(),
    };

    const updatedHotel = await hotelService.updateHotelByPhone(phone, updatedData);
    if (!updatedHotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    res.status(200).json({ success: true, message: "Hotel updated successfully.", data: updatedHotel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update hotel.", error: error.message });
  }
};

// ✅ Delete hotel by ID
const deleteHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHotel = await hotelService.deleteHotelById(id);
    if (!deletedHotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    res.status(200).json({ success: true, message: "Hotel deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete hotel.",
      error: error.message,
    });
  }
};

// ✅ Find nearest hotels (Requires location data in body)
const findNearestHotels = async (req, res) => {
  const { latitude, longitude, maxRadius } = req.body;
  try {
    const hotels = await hotelService.findNearestHotels(latitude, longitude, maxRadius);
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error finding nearest hotels:", error.message);
    res.status(500).json({ message: "Server error in finding nearest hotels", error: error.message });
  }
};

// ✅ Filter hotels (Requires filter parameters in query)
const filterHotels = async (req, res) => {
  try {
    // Extract filter and sort options from query parameters
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const sortOption = req.query.sort ? JSON.parse(req.query.sort) : {};

    const hotels = await hotelService.filterHotels(filter, sortOption);
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error filtering hotels:", error.message);
    res.status(500).json({ message: "Server error in filtering hotels", error: error.message });
  }
};

// ✅ Get one hotel detail by ID
const getOneHotelDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotels.findById(id); // Assuming model is imported as Hotels
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  createHotel,
  getAllHotels,
  getOneHotel,
  updateHotel,
  deleteHotel,
  findNearestHotels,
  filterHotels,
  getOneHotelDetail,
};