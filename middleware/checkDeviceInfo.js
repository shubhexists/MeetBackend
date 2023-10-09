const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const setDeviceInfo = asyncHandler(async (req, res, next) => {
  const { userId, deviceInfo } = req.body;
  if (!userId || !deviceInfo) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ username: userId });
  if (user.deviceInfo != "" || user.deviceInfo != null) {
    if (user.deviceInfo.includes(deviceInfo)) {
      next();
    } else {
      res.status(400);
      throw new Error(
        "Only One Device is allowed to login at a time. Kindly Contact Admin.",
      );
    }
  } else {
    user.deviceInfo = deviceInfo;
    await user.save();
  }
});

module.exports = setDeviceInfo;
