const asyncHandler = require("express-async-handler");
const Owner = require("../models/ownerModel");
const Admin = require("../models/adminModel");

const createOwner = asyncHandler(async (req, res) => {
    const { ownerId, ownerName, password, role, limitOfAdmin } = req.body;
    if (!ownerId || !ownerName || !password || !role || !limitOfAdmin) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }
    const ownerIdExists = await Owner.findOne({ ownerId });
    if (ownerIdExists) {
      res.status(400).json({
        message: "OwnerId already exists",
      });
    }
    const owner = await Owner.create({
      ownerId,
      ownerName,
      password,
      role,
      rooms: [],
      isDisabled: false,
      limitOfAdmin,
      admins: [],
    });
    if (owner) {
      res.status(201).json({
        message: "Owner created",
      });
    } else {
      res.status(400);
      throw new Error("Invalid Owner data");
    }
  });

const registerAdmin = asyncHandler(async (req, res) => {
    
  });
  
module.exports = { createOwner };