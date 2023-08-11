const express = require("express");
const router = express.Router();
const {changeStatusTrue, changeStatusFalse} = require("../controllers/userControllers.js");

router.put("/changeStatusTrue/:id", changeStatusTrue);
router.put("/changeStatusFalse/:id", changeStatusFalse);

module.exports = router;
