const express = require("express");
const { registerUser, loginUser, createOwner } = require("../controllers/authControllers");
const checkOwner = require("../middleware/checkOwnerHandler");
const validateToken = require("../middleware/validateTokenHandler");
const checkDeviceInfo = require("../middleware/checkDeviceInfo");
const router = express.Router();

router.post("/register", registerUser); //Add JWT (validateToken and checkOwner)
router.post("/login", loginUser); //Add check Device Info
router.post("/createOwner", createOwner);

 
module.exports = router;
