const express = require("express");
const router = express.Router();
const {getAllUsers,getAllAdmins, createNewRoom, getAllRooms, deleteUser, deleteAdmin, loginAdmin, deleteRoom, enableRoom, disableRoom, addRoom, getAdmin, getRoom} = require("../controllers/adminControllers.js");
// const {loginUser} = require("../controllers/authControllers.js");
// const checkOwner = require("../middleware/checkOwnerHandler.js");

router.get("/getusers",getAllUsers);
router.get("/getadmins",getAllAdmins);
router.get("/getrooms",getAllRooms);
router.get("/getAdmin/:id",getAdmin);
router.get("/getRoom/:id",getRoom);

router.post('/auth/login',loginAdmin); 
router.post('/createRoom',createNewRoom);
// router.put("/setDeviceInfo",setDeviceInfo);
router.delete("/deleteUser/:id",deleteUser);
router.delete("/deleteAdmin/:id",deleteAdmin);
router.delete("/deleteRoom/:id",deleteRoom);
router.put("/enableRoom/:id",enableRoom);
router.put("/disableRoom/:roomId",disableRoom);
router.put("/addRoom/:id/:roomId",addRoom);

module.exports = router;