const express = require("express");
const { registerUser, loginUser, createOwner, registerAdmin } = require("../controllers/authControllers");
const checkOwner = require("../middleware/checkOwnerHandler");
const validateToken = require("../middleware/validateTokenHandler");
const checkDeviceInfo = require("../middleware/checkDeviceInfo");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); 
router.post("/createOwner", createOwner);
router.post("/createAdmin", registerAdmin);

module.exports = router;
