const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
   
  },
  imageUrl: String,
  rideRequests: {
    type: Map,
    of: {
      requesterId: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      requesterImageUrl: String,
      requesterName: String,
      rideId: {
        type: Schema.Types.ObjectId,
        ref: "AvailableRide"
      },
      pickUp: {
        lat: Number,
        lng: Number,
      },
      destination: {
        lat: Number,
        lng: Number,
      },
      seats: Number,
      distance: Number,
      unitCost: Number,
      pickUpDate: Date,
      pickUpTime: String,
      message: String,
    },
  },
  pendingPayments: {
    type: Map,
    of: {
        rideId: {
            type: Schema.Types.ObjectId,
            ref: "AvailableRide"
          },
          pickUp: {
            lat: Number,
            lng: Number,
          },
          destination: {
            lat: Number,
            lng: Number,
          },
          seats: Number,
          distance: Number,
          unitCost: Number,
          pickUpDate: Date,
          pickUpTime: String,
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
