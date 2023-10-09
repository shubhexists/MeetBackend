const mongoose = require("mongoose");
const announcementSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, "Please enter the roomId"],
    },
    message: {
      type: String,
      required: [true, "Please enter the message"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Announcement", announcementSchema);
