const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the name"],
        },
        isDisabled:{
            type: Boolean,
            default: false,
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
            type: String,
            required: [true, "Please enter the roomId alloted"],
        },
        role:{
            type: String,
            required: [true, "Please enter the role"],
        },
        deviceInfo:{
            type: String,
        },
        isOnline:{
            type: Boolean,
            default: false,
        },
        referal:{
            type: String,
        },
        isMuted:{
            type:Boolean,
            default: false,
        },
        isAudioSubscribed:{
            type: Boolean,
            default : true
        },
        lastLogTime:{
            type: String,
            default: ""
        },
        isSpeaking:{
            type: Boolean,
            default: false,
        }
    },{
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);