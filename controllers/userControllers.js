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
  const user = await User.findOne({ username: id });
  if(user.deviceInfo === "" || user.deviceInfo === undefined) {
    user.deviceInfo = deviceInfo;
  }
  await user.save();
  res.json({ message: "Device Info Changed" });
});

const changeDevice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  user.deviceInfo = "";
  await user.save();
  res.json({ message: "Device Info Changed" });
})

const getAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const an = await Announcement.findOne({ roomId: id });
  res.json(an);
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId, password, newpassword } = req.body;
  console.log(userId);
  console.log(password);
  const user = await User.findOne({ username: userId });
  console.log(user);
  if (user && password === user.password) {
    console.log("Password Matched");
    // const newEncryptedpassword = await bcrypt.hash(newpassword, 10);
    await User.findOneAndUpdate(
      { username: userId },
      {
        password: newpassword,
      }
    );
    res.json({ message: "Password Changed" });
  } else {
    console.log("Password Not Matched");
    res.status(401);
    throw new Error("Invalid Password");
  }
});

const changeLogTime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { logTime } = req.body;
  console.log(id);
  console.log(logTime);
  const user = await User.findOne({ username: id });
  user.lastLogTime = logTime;
  await user.save();  
  res.json({ message: "Log Time Changed" });
});

const setIsSpeaking = asyncHandler(async (req,res) => {
  const { id } = req.params;
  const user = await User.findOne({username: id});
  user.isSpeaking = true;
  await user.save();
  res.json({
    message: "User is now speaking"
  });
});

const setIsMute = asyncHandler(async (req,res) => {
  const { id } = req.params;
  const user = await User.findOne({username: id});
  user.isSpeaking = false;
  await user.save();
  res.json({
    message: "User is now Muted"
  });
});

module.exports = {
  changeStatusTrue,
  changeStatusFalse,
  changeLogTime,
  changeDevice,
  setDeviceInfo,
  getAnnouncement,
  changeUserPassword,
  setIsSpeaking,
  setIsMute
};
