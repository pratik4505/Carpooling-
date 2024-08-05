const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookedRideSchema = new Schema({
  rideId: {
    type: Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  },
  pastRideId: {
    type: Schema.Types.ObjectId,
    ref: "PastRide",
    required: true,
  },
  driverPastId: {
    type: Schema.Types.ObjectId,
    ref: "PastRide",
    required: true,
  },
  passengerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  passengerName: {
    type: String,
    required: true,
  },
  passengerImageUrl: {
    type: String,
   
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  driverImageUrl: {
    type: String,
    
  },
  seats: {
    type: Number,
    required: true,
  },
  pickUp: {
    type: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  destination: {
    type: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  pickUpAddress: {
    type: String,
    required: true,
  },
  destinationAddress: {
    type: String,
    required: true,
  },
  pickUpDate:{
    type: Date,
    required: true,
  } ,
  pickUpTime:  {
    type: String,
    required: true,
  },
  unitCost: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  verificationCode: {
    type: Number,
    required: true,
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
  },
},
{
  timestamps: true,
});


//think on it

bookedRideSchema.index({rideId:1 });


const BookedRide = mongoose.model("BookedRide", bookedRideSchema);

module.exports = BookedRide;
