const express = require("express");
const router = express.Router();
const {
  createOwner,
  registerAdmin,
} = require("../controllers/ownerControllers");

router.post("/createOwner", createOwner);
router.post("/registerAdmin", registerAdmin);

module.exports = router;