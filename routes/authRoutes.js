const express = require("express");
const { registerUser, loginUser, createOwner } = require("../controllers/authControllers");
const checkOwner = require("../middleware/checkOwnerHandler");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/register", validateToken, checkOwner, registerUser);
router.post("/login", loginUser);
router.post("/createOwner", createOwner);

 
module.exports = router;
