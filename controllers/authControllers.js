const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Room = require("../models/roomModels");
const Admin = require("../models/adminModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
//Only Owner can register a user
const registerUser = asyncHandler(async (req, res) => {
  console.log("Registering User");
  const { name, username, password, roomId, role, referal } = req.body;
  if (!name || !username || !password || !roomId || !role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
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
    password: hashedPassword,
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
    }
  );

  if (user) {
    console.log("User created");
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

//@desc Login the user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  console.log("Logging in User");
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ username });
  if (user.role === "Host") {
    if (user && (await bcrypt.compare(password, user.password))) {
      const room = await Room.findOne({ roomId: user.roomId });
      if (room.isDisabled) {
        res.status(401).json({
          message: "Room is disabled. Contact your admin for more details.",
        });
      } else {
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
          process.env.ACCESS_TOKEN_SECRET
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
    if (user && (await bcrypt.compare(password, user.password))) {
      const room = await Room.findOne({ roomId: user.roomId });
      if (room.isDisabled) {
        res.status(401).json({
          message: "Room is disabled. Contact your admin for more details.",
        });
      } else {
        if(room.isHostIn){
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
          process.env.ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
          accessToken,
          username: user.username,
          roomId: user.roomId,
          role: user.role,
        });
      }else{
        res.status(401).json({
          message: "Host is not in the room. Contact your admin for more details.",
        });
      }}
    }
  }
});

//@desc Create a new Owner
//@route POST /api/auth/createOwner
//@access public

//This Route has to be called manually and isn't placed on the GUI
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
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await Admin.create({
    name,
    username,
    password: hashedPassword,
    roomId: ["All"],
    role: "Owner",
  });
  if (user) {
    console.log("Owner created");
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

//@desc Create a new Admin
//@route POST /api/auth/createAdmin
//@access public
const registerAdmin = asyncHandler(async (req, res) => {
  console.log("Registering Admin");
  const { name, username, password, role } = req.body;
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
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    username,
    password: hashedPassword,
    roomId: [],
    role,
  });
  console.log("Admin created");
  if (admin) {
    console.log("Admin created");
    res.status(201).json({
      _id: admin.id,
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
