const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
    {
        roomId:{
            type: String,
            required: [true, "Please enter the roomId."],
        },
        users:{
            type: [String],
            required: [true, "Please enter the role"],
        },
        description:{
            type: String,
        }
    },{
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);