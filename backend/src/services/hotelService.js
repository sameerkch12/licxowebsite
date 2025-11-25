const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Hotels = require("../models/hotelModel");

const uploadImagesToCloudinary = async (images) => {
    if (!images || images.length === 0) return [];
  
    const results = await Promise.allSettled(
      images.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, { folder: "hotels" });
          
          // Remove file from local storage
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
  
          return {
            public_id: result.public_id,
            url: result.secure_url,
            secure_url: result.secure_url, // Correctly handle secure_url
          };
        } catch (error) {
          console.error("Cloudinary upload failed:", error.message); // Correct error logging
          return null; // Skip failed uploads
        }
      })
    );
  
    // Filter successfully uploaded images
    return results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  };
  
  
  // Create hotel
  const createHotel = async (hotelData, images) => {
    const uploadedImages = await uploadImagesToCloudinary(images);
    const newHotel = new Hotels({ ...hotelData, images: uploadedImages });
    return await newHotel.save();
  };

const getAllHotels = async () => {
  return await Hotels.find();
};

const getOneHotelByPhone = async (phone) => {
  return await Hotels.find({ phone });
};

const findNearestHotels = async (latitude, longitude, maxRadius) => {
  return await Hotels.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point", // GeoJSON format
          coordinates: [parseFloat(longitude), parseFloat(latitude)] // Ensure coordinates are [longitude, latitude]
        },
        distanceField: "dist.calculated", // Field where the distance will be stored
        maxDistance: parseFloat(maxRadius) * 1609, // Convert miles to meters
        spherical: true, // Use spherical calculations for geospatial accuracy
      },
    },
  ]);
};




const filterHotels = async (filter, sortOption) => {
  return await Hotels.find(filter).sort(sortOption);
};

const updateHotelByPhone = async (phone, updateData) => {
  const hotel = await Hotels.findOne({ phone });
  if (!hotel) return null;

  Object.assign(hotel, updateData);
  return await hotel.save();
};

const deleteHotelById = async (id) => {
  // Mongoose ki findByIdAndDelete method use karein
  return await Hotels.findByIdAndDelete(id);
};


module.exports = {
  createHotel,
  getAllHotels,
  getOneHotelByPhone,
  findNearestHotels,
  filterHotels,
  updateHotelByPhone,
  deleteHotelById,
};
