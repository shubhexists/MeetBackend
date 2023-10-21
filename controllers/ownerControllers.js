const asyncHandler = require("express-async-handler");
const Owner = require("../models/ownerModel");
const Admin = require("../models/adminModel");
const LokiTransport = require("winston-loki");
const { createLogger } = require("winston");

const logger = createLogger({
  transports: [
    new LokiTransport({
      host: "http://localhost:3100",
    }),
  ],
});


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
  const adminCheck = await Admin.findOne({ username: ownerId });
  if (adminCheck) {
    res.status(400).json({
      message: "An admin with this username already exists",
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
    logger.info(`Owner ${ownerId} created`);
    res.status(201).json({
      message: "Owner created",
    });
  } else {
    res.status(400);
    throw new Error("Invalid Owner data");
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, username, password, referal, owner } = req.body;
  if (!name || !username || !password || !referal || !owner) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const adminExists = await Admin.findOne({ username });
  if (adminExists) {
    res.status(400).json({
      message: "Admin already exists",
    });
  } else {
    const ownerExists = await Owner.findOne({ ownerId: owner });
    if (!ownerExists) {
      res.status(400).json({
        message: "Owner does not exist",
      });
    } else {
      // CHECK IF THE ADMIN COUNT IS NOT EXCEEDED FOR THE OWNER
      const adminCount = await Admin.find({ owner: owner });
      if (adminCount.length >= ownerExists.limitOfAdmin) {
        res.status(400).json({
          message: "Admin limit exceeded",
        });
      } else {
        const admin = await Admin.create({
          name,
          username,
          password,
          referal,
          roomId: [],
          isDisabled: false,
          role: "Admin",
          owner,
        });
        if (admin) {
          logger.info(`Admin ${username} created under ${owner}`);
          res.status(201).json({
            _id: admin.id,
            password: admin.password,
            username: admin.username,
            name: admin.name,
            roomId: admin.roomId,
            role: admin.role,
          });
        } else {
          res.status(400);
          throw new Error("Invalid Admin data");
        }
      }
    }
  }
});

const getRoomsOfOwner = asyncHandler(async (req, res) => {
  const { owner } = req.body;
  if (!owner) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const ownerExists = await Owner.findOne({ ownerId: owner });
  if (!ownerExists) {
    res.status(400).json({
      message: "Owner does not exist",
    });
  } else {
    res.status(200).json({
      rooms: ownerExists.rooms,
    });
  }
});

module.exports = { createOwner, registerAdmin, getRoomsOfOwner };
