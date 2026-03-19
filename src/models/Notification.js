const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);