const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const Announcement = require("../models/announcementModel.js");
//@desc Change Status of a user to True
//@route PUT /api/user/changeStatusTrue/:id
//@access public
const changeStatusTrue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findOneAndUpdate({ username: id }, { isOnline: true });
  res.json({ message: "Status Changed" });
});

//@desc Change Status of a user to False
//@route PUT /api/user/changeStatusFalse/:id
//@access public
const changeStatusFalse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findOneAndUpdate({ username: id }, { isOnline: false });
  res.json({ message: "Status Changed" });
});

const setDeviceInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { deviceInfo } = req.body;
  await User.findOneAndUpdate({ username: id }, { deviceInfo });
});

const getAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const an = await Announcement.findOne({ roomId: id });
  res.json(an);
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId, password, newpassword } = req.body;
  const user = await User.findOne({ username: userId });
  console.log(user);
  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("Password Matched");
    const newEncryptedpassword = await bcrypt.hash(newpassword, 10);
    await User.findOneAndUpdate(
      { username: userId },
      {
        password: newEncryptedpassword,
      }
    );
    res.json({ message: "Password Changed" });
  } else {
    console.log("Password Not Matched");
    res.status(401);
    throw new Error("Invalid Password");
  }
});


module.exports = {
  changeStatusTrue,
  changeStatusFalse,
  setDeviceInfo,
  getAnnouncement,
  changeUserPassword,
};
