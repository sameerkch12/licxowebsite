const express = require('express');
const {
  addToShortlist,
  removeFromShortlist,
  getShortlistedRooms,
  isRoomShortlisted
} = require('../controllers/shortlistController');

const shortlistRoute = express.Router();

// Add room to shortlist
shortlistRoute.post('/add', addToShortlist);  // ${API_URL}/api/v1/shortlist/add

// Remove room from shortlist
shortlistRoute.delete('/remove/:userId/:roomId', removeFromShortlist);  // ${API_URL}/api/v1/shortlist/remove/:userId/:roomId

// Get user's shortlisted rooms
shortlistRoute.get('/user/:userId', getShortlistedRooms);  // ${API_URL}/api/v1/shortlist/user/:userId

// Check if room is shortlisted
shortlistRoute.get('/check/:userId/:roomId', isRoomShortlisted);  // ${API_URL}/api/v1/shortlist/check/:userId/:roomId

module.exports = shortlistRoute;