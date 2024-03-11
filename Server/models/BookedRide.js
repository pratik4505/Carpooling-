const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookedRideSchema = new Schema({
  rideId: {
    type: Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  },
  passengerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  pickUp: {
    lat: Number,
    lng: Number,
  },
  destination: {
    lat: Number,
    lng: Number,
  },
  pickUpAddress: {
    type: String,
    required: true,
  },
  destinationAddress: {
    type: String,
    required: true,
  },
  pickUpDate: Date,
  pickUpTime: String,
  unitCost: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
  },
  verificationCode: {
    type: Number,
  },
  codeVerified: {
    type: Boolean,
    default: false,
  },
  rideCancelled: {
    type: Boolean,
    default: false,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  overview_polyline: {
    type: String,
    required: true,
  }
});

const BookedRide = mongoose.model("BookedRide", bookedRideSchema);

module.exports = BookedRide;
