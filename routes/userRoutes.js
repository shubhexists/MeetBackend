const express = require("express");
const router = express.Router();
const {changeStatusTrue, changeStatusFalse,setDeviceInfo, getAnnouncement} = require("../controllers/userControllers.js");
router.get("/getAnnouncement/:id",getAnnouncement);

router.put("/changeStatusTrue/:id", changeStatusTrue);
router.put("/changeStatusFalse/:id", changeStatusFalse);
router.put("/setDeviceInfo/:id",setDeviceInfo);


module.exports = router;
