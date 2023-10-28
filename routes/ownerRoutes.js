const express = require("express");
const router = express.Router();
const {
  createOwner,
  registerAdmin,
  getRoomsOfOwner,
  getOwners,
  disableOwner,
  enableOwner,
} = require("../controllers/ownerControllers");

router.get("/getOwners", getOwners);
router.get("/getRoomsOfOwner", getRoomsOfOwner);

router.post("/createOwner", createOwner);
router.post("/registerAdmin", registerAdmin);

router.put("/disableOwner", disableOwner);
router.put("/enableOwner", enableOwner);
module.exports = router;