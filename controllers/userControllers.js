const asyncHandler = require("express-async-handler");
const User =  require("../models/userModel.js");
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

module.exports = {changeStatusTrue,changeStatusFalse,setDeviceInfo};