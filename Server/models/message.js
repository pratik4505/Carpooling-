const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    rideId: {
      //rideId
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ rideId: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
