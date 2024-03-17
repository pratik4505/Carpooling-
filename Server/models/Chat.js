const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  rideId: { 
    type: String,
    required: true,
  },
  members: {
    type: Map,
    of: {
      name: String,
      imageUrl: String,
    },
  },
  chatName: {
    type: String,
    required: true,
  },
  driverId:{
    type: String,
    required: true,
  }
},
{
  timestamps: true,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
