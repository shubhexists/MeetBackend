const express = require("express");
const router = express.Router();
const {
  changeStatusTrue,
  changeStatusFalse,
  setDeviceInfo,
  getAnnouncement,
  changeUserPassword,
  changeLogTime,
  changeDevice,
  setIsSpeaking,
  setIsMute,
  getRoomUsers,
  getAdminFromRoomId,
  setUserNotSpeaking,
} = require("../controllers/userControllers.js");

router.get("/getAnnouncement/:id", getAnnouncement);
router.get("/getRoomUsers/:id", getRoomUsers);
router.get("/getAdminFromRoomId/:id", getAdminFromRoomId);

router.post("/changePassword", changeUserPassword);
router.post("/changeLogTime/:id", changeLogTime);

router.put("/changeStatusTrue/:id", changeStatusTrue);
router.put("/changeStatusFalse/:id", changeStatusFalse);
router.put("/setDeviceInfo/:id", setDeviceInfo);
router.put("/changeDevice/:id", changeDevice);
router.put("/setIsSpeaking/:id", setIsSpeaking);
router.put("/setIsMute/:id", setIsMute);
router.put('/setNotSpeaking/:id', setUserNotSpeaking);

module.exports = router;
