const mongoose = require("mongoose");
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
    roomId:{
        type: [String],
        required: [true, "Please enter the roomId(s) alloted"],
    },
    role:{
        type: String,
        required: [true, "Please enter the role"],
    },
}
);

module.exports = mongoose.model("Admin", adminSchema);