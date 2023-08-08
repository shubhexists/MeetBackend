const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControllers");
const checkOwner = require("../middleware/checkOwnerHandler");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/register", validateToken, checkOwner, registerUser);
router.post("/login", loginUser);

 
module.exports = router;
