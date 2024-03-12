const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: { type: String },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: false, // Allow any fields not explicitly specified in the schema
  }
);

notificationSchema.index({userId:1});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
