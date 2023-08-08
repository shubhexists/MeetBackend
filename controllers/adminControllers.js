const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc get all users
//@route GET /api/admin/getusers
//@access public

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({
        role: "User",
    });
    res.json(users);
    }
);

//@desc get all admins
//@route GET /api/admin/getadmins
//@access public
const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await User.find({
        role: "Admin",
    });
    res.json(admins);
    }
);


module.exports = {getAllUsers, getAllAdmins};