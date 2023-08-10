const express = require("express");
const router = express.Router();
const {getAllUsers,getAllAdmins, createNewRoom} = require("../controllers/adminControllers.js");
const {loginUser} = require("../controllers/authControllers.js");
const checkOwner = require("../middleware/checkOwnerHandler.js");

router.get("/getusers",getAllUsers);
router.get("/getadmins",getAllAdmins);
router.get("getrooms",)
//allow only owner to login
router.post('/auth/login',checkOwner,loginUser);
router.post('/createRoom',createNewRoom);
module.exports = router;