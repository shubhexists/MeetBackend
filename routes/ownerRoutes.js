const express = require("express");
const router = express.Router();
const {
  createOwner,
  registerAdmin,
  getRoomsOfOwner,
} = require("../controllers/ownerControllers");

router.get("/getRoomsOfOwner", getRoomsOfOwner);

router.post("/createOwner", createOwner);
router.post("/registerAdmin", registerAdmin);

module.exports = router;