const express = require("express");
const router = express.Router();
const {getAllUsers,getAllAdmins, createNewRoom, getAllRooms, deleteUser} = require("../controllers/adminControllers.js");
const {loginUser} = require("../controllers/authControllers.js");
const checkOwner = require("../middleware/checkOwnerHandler.js");

router.get("/getusers",getAllUsers);
router.get("/getadmins",getAllAdmins);
router.get("/getrooms",getAllRooms)
//allow only owner to login
router.post('/auth/login',loginUser); 
router.post('/createRoom',createNewRoom);
// router.put("/setDeviceInfo",setDeviceInfo);
router.delete("/deleteUser/:id",deleteUser);
module.exports = router;