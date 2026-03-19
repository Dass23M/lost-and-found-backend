const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "electronics",
        "clothing",
        "accessories",
        "documents",
        "pets",
        "keys",
        "bags",
        "other",
      ],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["lost", "found"],
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);