const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Room = require("../models/roomModels");

//@desc Register a user
//@route POST /api/users/register
//@access public
//Only Owner can register a user
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password, roomId, role } = req.body;
  //REMEMBER RoomID IS AN ARRAY HERE
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
  const roomExists = await User.findOne({
    roomId
  });
  if (!roomExists) {
    res.status(400);
    throw new Error("Room does not exists. Kindly make the Room first.")
  }
  const user = await User.create({
    name,
    username,
    password: hashedPassword,
    roomId,
    role,
  });
  const room = await Room.findByIdAndUpdate(
    roomId,
    { $push: { users: username } },
    { new: true } 
  )

  if (user) {
    console.log("User created");
    res
      .status(201)
      .json({
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
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
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
      { expiresIn: "1m" }
    );
    res.status(200).json({ accessToken, "username":user.username, "roomId":user.roomId , "role":user.role });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

//@desc Create a new Owner
//@route POST /api/auth/createOwner
//@access public
//This Route has to be called manually and isn't placed on the GUI

const createOwner = asyncHandler(async (req, res) => {
  const { name, username, password, roomId, role } = req.body;
  //REMEMBER RoomId IS AN ARRAY HERE 
  if (!name || !username || !password || !roomId || !role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const ownerExists = await User.findOne({ role: "Owner" });
  if (ownerExists) {
    res.status(400);
    throw new Error("Owner already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    username,
    password: hashedPassword,
    roomId,
    role,
  });
  if (user) {
    console.log("Owner created");
    res
      .status(201)
      .json({
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

module.exports = { registerUser, loginUser, createOwner};
