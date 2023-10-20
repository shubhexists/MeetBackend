const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Room = require("../models/roomModels");
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

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password, roomId, role, referal } = req.body;
  logger.info(`Request to create User - ${username}`);
  if (!name || !username || !password || !roomId || !role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400).json({
      message: "Username already exists",
    });
  }
  const roomExists = await Room.findOne({
    roomId,
  });
  if (!roomExists) {
    res.status(400);
    throw new Error("Room does not exists. Kindly make the Room first.");
  }
  const user = await User.create({
    name,
    username,
    password: password,
    roomId,
    role,
    deviceInfo: "",
    isOnline: false,
    referal,
  });

  const room = await Room.findOneAndUpdate(
    { roomId: roomId },
    {
      $push: { users: username },
    },
    {
      new: true,
    },
  );

  if (user) {
    logger.info(`User ${username} created`);
    res.status(201).json({
      _id: user.id,
      username: user.username,
      name: user.name,
      roomId: user.roomId,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { username, password, device } = req.body;
  logger.info(`Request to login User - ${username}`);
  if (!username || !password || !device) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ username });
  if (user.role === "Host") {
    if (
      user.deviceInfo === device ||
      user.deviceInfo === null ||
      user.deviceInfo === ""
    ) {
      if (user && password === user.password) {
        const room = await Room.findOne({ roomId: user.roomId });
        if (room.isDisabled) {
          res.status(401).json({
            message: "Room is disabled. Contact your admin for more details.",
          });
        } else {
          room.isHostIn = true;
          await room.save();
          const accessToken = jwt.sign(
            {
              user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                roomId: user.roomId,
                role: user.role,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
          );
          res.status(200).json({
            accessToken,
            username: user.username,
            roomId: user.roomId,
            role: user.role,
          });
        }
      } else {
        res.status(401);
        throw new Error("Invalid username or password");
      }
    } else {
      res.status(401).json({
        message: "Invalid device. Contact your admin for more details.",
      });
    }
  } else {
    if (
      user.deviceInfo === device ||
      user.deviceInfo === null ||
      user.deviceInfo === ""
    ) {
      if (user && password === user.password) {
        const room = await Room.findOne({ roomId: user.roomId });
        if (room.isDisabled) {
          res.status(401).json({
            message: "Room is disabled. Contact your admin for more details.",
          });
        } else {
          if (room.isHostIn) {
            if (user.isDisabled !== true) {
              const accessToken = jwt.sign(
                {
                  user: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    roomId: user.roomId,
                    role: user.role,
                  },
                },
                process.env.ACCESS_TOKEN_SECRET,
              );
              logger.info(`User ${username} logged in`);
              res.status(200).json({
                accessToken,
                username: user.username,
                roomId: user.roomId,
                role: user.role,
              });
            } else {
              res.status(401).json({
                message:
                  "User is disabled. Contact your admin for more details.",
              });
            }
          } else {
            res.status(401).json({
              message:
                "Host is not in the room. Contact your admin for more details.",
            });
          }
        }
      } else {
        res.status(401);
        throw new Error("Invalid username or password");
      }
    } else {
      res.status(401).json({
        message: "Invalid device. Contact your admin for more details.",
      });
    }
  }
});

const createOwner = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;
  //REMEMBER RoomId IS AN ARRAY HERE
  if (!name || !username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const usernameExists = await Admin.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists");
  }
  const user = await Admin.create({
    name,
    username,
    password: password,
    roomId: ["All"],
    role: "Owner",
  });
  if (user) {
    logger.info(`Owner ${username} created`);
    res.status(201).json({
      _id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, username, password, role, description } = req.body;
  //REMEMBER RoomId IS AN ARRAY HERE
  if (!name || !username || !password || !role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const adminExists = await Admin.findOne({ username });
  if (adminExists) {
    res.status(400);
    throw new Error("Username already exists");
  }
  const admin = await Admin.create({
    name,
    username,
    password: password,
    roomId: [],
    referal: description,
    role,
  });
  if (admin) {
    logger.info(`Admin ${username} created`);
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
    throw new Error("Invalid user data");
  }
});

module.exports = { registerUser, loginUser, createOwner, registerAdmin };
