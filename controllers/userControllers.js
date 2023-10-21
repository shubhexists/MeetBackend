const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const Room = require("../models/roomModels.js");
const Admin = require("../models/adminModel.js");
const Announcement = require("../models/announcementModel.js");
const LokiTransport = require("winston-loki");
const { createLogger } = require("winston");

const logger = createLogger({
  transports: [
    new LokiTransport({
      host: "http://localhost:3100",
    }),
  ],
});

const changeStatusTrue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findOneAndUpdate({ username: id }, { isOnline: true });
  res.json({ message: "Status Changed" });
});


const changeStatusFalse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findOneAndUpdate({ username: id }, { isOnline: false });
  res.json({ message: "Status Changed" });
});

const setDeviceInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { deviceInfo } = req.body;
  const user = await User.findOne({ username: id });
  if (user.deviceInfo === "" || user.deviceInfo === undefined) {
    user.deviceInfo = deviceInfo;
  }
  await user.save();
  logger.info(`User ${id} device set to ${deviceInfo}`);
  res.json({ message: "Device Info Changed" });
});

const changeDevice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  user.deviceInfo = "";
  await user.save();
  logger.info(`User ${id} device info changed`);
  res.json({ message: "Device Info Changed" });
});

const getAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const an = await Announcement.findOne({ roomId: id });
  res.json(an);
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId, password, newpassword } = req.body;
  const user = await User.findOne({ username: userId });
  if (user && password === user.password) {
    await User.findOneAndUpdate(
      { username: userId },
      {
        password: newpassword,
      },
    );
    logger.info(`User ${userId} changed password to ${newpassword}`);
    res.json({ message: "Password Changed" });
  } else {
    res.status(401);
    throw new Error("Invalid Password");
  }
});

const changeLogTime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { logTime } = req.body;
  const user = await User.findOne({ username: id });
  user.lastLogTime = logTime;
  await user.save();
  logger.info(`User ${id} logged in at ${logTime}`);
  res.json({ message: "Log Time Changed" });
});

const setIsSpeaking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  user.isSpeaking = true;
  await user.save();
  logger.info(`User ${id} can now speak`);
  res.json({
    message: "User is now speaking",
  });
});

const setIsMute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  user.isSpeaking = false;
  await user.save();
  logger.info(`User ${id} is now muted`);
  res.json({
    message: "User is now Muted",
  });
});

const getRoomUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId: id });
  const users = room.users;
  res.json({ users: users });
});

const getAdminFromRoomId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId: id });
  const users = room.users;
  for (var i = 0; i < users.length; i++) {
    const admin = await Admin.findOne({ username: users[i] });
    if (admin) {
      res.json({ admin: admin });
      break;
    }
  }
});

const setUserOnMuteInDb = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  user.isMuted = true;
  await user.save();
  res.json({
    message: "User is now muted",
  });
});

const setUserNotMuteInDb = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  user.isMuted = false;
  await user.save();
  res.json({
    message: "User is now unmuted",
  });
});

module.exports = {
  changeStatusTrue,
  changeStatusFalse,
  changeLogTime,
  changeDevice,
  setDeviceInfo,
  getRoomUsers,
  getAnnouncement,
  changeUserPassword,
  setIsSpeaking,
  getAdminFromRoomId,
  setIsMute,
  setUserOnMuteInDb,
  setUserNotMuteInDb,
};
