const mongoose = require('mongoose');

const AvailableRideSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  overview_polyline: {
    type: String,
    required: true
  }
});

const AvailableRide = mongoose.model('AvailableRide', AvailableRideSchema);

module.exports = AvailableRide;
