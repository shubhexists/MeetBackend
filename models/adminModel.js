const mongoose = require("mongoose");
const utcTimestamp = Date.now();
const utcDate = new Date(utcTimestamp);
const istTimestamp = utcTimestamp + (5 * 60 + 30) * 60 * 1000;
const istDate = new Date(istTimestamp);
const istYear = istDate.getUTCFullYear();
const istMonth = istDate.getUTCMonth() + 1; // Months are 0-indexed
const istDay = istDate.getUTCDate();

// Format the date in YYYY-MM-DD format
const formattedISTDate = `${istYear}-${istMonth.toString().padStart(2, '0')}-${istDay.toString().padStart(2, '0')}`;

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name"],
    },
    username: {
        type: String,
        required: [true, "Please enter the username"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
    },
    referal:{
        type: String,
    },
    dateCreated:{
        type: Date,
        default: formattedISTDate,
    },
    roomId:{
        type: [String],
        required: [true, "Please enter the roomId(s) alloted"],
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        required: [true, "Please enter the role"],
    },
}
);

module.exports = mongoose.model("Admin", adminSchema);