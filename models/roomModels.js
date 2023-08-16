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
        password: {
          type: String,
          required: [true, "Please enter the room password."],  
        },
        description:{
            type: String,
        },
        isDisabled:{
            type: Boolean,
            default: false,
        },
        isHostIn:{
            type: Boolean,
            default: false,
        }
    },{
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);