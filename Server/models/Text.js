
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema(
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

textSchema.index({ rideId: 1 });

const Text = mongoose.model("Text", textSchema);

module.exports = Text;
