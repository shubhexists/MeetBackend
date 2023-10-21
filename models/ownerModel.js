const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema(
    {
        ownerId: {
            type: String,
            required: [true, "Please enter the ownerId."],
            unique: true
        },
        ownerName: {
            type: String,
            required: [true, "Please enter the ownerName."],
        },
        password:{
            type: String,
            required: [true, "Please enter the password."],
        },
        role:{
            type: String,
            required: [true, "Please enter the role."],
        },
        rooms: {
            type: [String]
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        limitOfAdmin: {
            type: Number,
            required: [true, "Please enter the limitOfAdmin."],
        }
    }
);

module.exports = mongoose.model("Owner", OwnerSchema);