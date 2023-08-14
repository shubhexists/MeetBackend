const asyncHandler = require("express-async-handler");
const User =  require("../models/userModel.js");
const Announcement = require("../models/announcementModel.js");
//@desc Change Status of a user to True
//@route PUT /api/user/changeStatusTrue/:id
//@access public
const changeStatusTrue = asyncHandler(async (req,res) => {
    const { id } = req.params;
    await User.findOneAndUpdate({username: id}, {isOnline: true});
    res.json({message: "Status Changed"});
    });

//@desc Change Status of a user to False
//@route PUT /api/user/changeStatusFalse/:id
//@access public
const changeStatusFalse = asyncHandler(async (req,res) => {
    const { id } = req.params;
    await User.findOneAndUpdate({username: id}, {isOnline: false});
    res.json({message: "Status Changed"});
});

const setDeviceInfo = asyncHandler(async (req,res) => {
    const { id } = req.params;
    const { deviceInfo } = req.body;
    await User.findOneAndUpdate(
        {username: id},
        {deviceInfo}
    )
});

const getAnnouncement = asyncHandler(async (req,res) => {
    const { id } = req.params;
    console.log(id);
    const an = await Announcement.findOne({roomId: id});
    res.json(an);
});

module.exports = {changeStatusTrue,changeStatusFalse,setDeviceInfo,getAnnouncement};