const Shortlist = require('../models/shortlistModel');
const mongoose = require("mongoose");
// Add room to shortlist
// Add room to shortlist
const addToShortlist = async (req, res) => {
  try {
    let { userId, roomId } = req.body;

    if (!userId || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and roomId are required",
      });
    }

    // Convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roomId format",
      });
    }
    
    roomId = new mongoose.Types.ObjectId(roomId);

    const shortlist = await Shortlist.create({
      userId,
      roomId,
    });

    res.status(201).json({
      success: true,
      message: "Room added to shortlist successfully",
      data: shortlist,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Room already shortlisted",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding room to shortlist",
      error: error.message,
    });
  }
};
// Remove room from shortlist
const removeFromShortlist = async (req, res) => {
  try {
    const { userId, roomId } = req.params;

    const result = await Shortlist.findOneAndDelete({
      userId,
      roomId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Shortlist entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room removed from shortlist successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing room from shortlist',
      error: error.message
    });
  }
};

// Get user's shortlisted rooms
const getShortlistedRooms = async (req, res) => {
  try {
    const { userId } = req.params;

    const shortlistedRooms = await Shortlist.find({ userId })
      .populate('roomId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: shortlistedRooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shortlisted rooms',
      error: error.message
    });
  }
};

// Check if a room is shortlisted by user
const isRoomShortlisted = async (req, res) => {
  try {
    const { userId, roomId } = req.params;

    const shortlist = await Shortlist.findOne({
      userId,
      roomId
    });

    res.status(200).json({
      success: true,
      isShortlisted: !!shortlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking shortlist status',
      error: error.message
    });
  }
};

module.exports = {
  addToShortlist,
  removeFromShortlist,
  getShortlistedRooms,
  isRoomShortlisted
};