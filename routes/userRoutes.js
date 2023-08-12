const express = require("express");
const router = express.Router();
const {changeStatusTrue, changeStatusFalse,setDeviceInfo} = require("../controllers/userControllers.js");

router.put("/changeStatusTrue/:id", changeStatusTrue);
router.put("/changeStatusFalse/:id", changeStatusFalse);
router.put("/setDeviceInfo/:id",setDeviceInfo);

module.exports = router;
