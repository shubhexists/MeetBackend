const express = require("express");
const router = express.Router();
const {changeStatusTrue, changeStatusFalse,setDeviceInfo, getAnnouncement, changeUserPassword} = require("../controllers/userControllers.js");

router.get("/getAnnouncement/:id",getAnnouncement);

router.post("/changePassword",changeUserPassword);

router.put("/changeStatusTrue/:id", changeStatusTrue);
router.put("/changeStatusFalse/:id", changeStatusFalse);
router.put("/setDeviceInfo/:id",setDeviceInfo);


module.exports = router;
