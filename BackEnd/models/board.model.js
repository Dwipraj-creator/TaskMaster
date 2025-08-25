const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "My Board",
    },
    columns: [
      {
        name: { type: String, required: true }, // e.g., "To Do"
        order: { type: Number, required: true }, // column position
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", BoardSchema);

module.exports = Board;