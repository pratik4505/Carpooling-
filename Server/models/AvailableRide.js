const mongoose = require("mongoose");

const AvailableRideSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  overview_polyline: {
    type: String,
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  unitCost: {
    type: Number,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
});

const AvailableRide = mongoose.model("AvailableRide", AvailableRideSchema);

module.exports = AvailableRide;
