const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pastRideSchema = new Schema({
    rideId: {
        type: Schema.Types.ObjectId,
        ref: 'AvailableRide',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    user: {
        type: String, // Can be 'driver' or 'passenger'
        required: true
    },
    ratings: {
        type: Map,
        of: {
            stars: {
                type: Number,
                min: 0,
                max: 5
            },
            description: String
        }
    },
    otherData: {
        type: Schema.Types.Mixed 
    }
});

const PastRide = mongoose.model('PastRide', pastRideSchema);

module.exports = PastRide;
