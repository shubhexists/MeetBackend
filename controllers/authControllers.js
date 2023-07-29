const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password, roomId, role } = req.body;
  //REMEMBER ROLE IS AN ARRAY HERE
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
  const user = await User.create({
    name,
    username,
    password: hashedPassword,
    roomId,
    role,
  });
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
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

module.exports = { registerUser, loginUser };
