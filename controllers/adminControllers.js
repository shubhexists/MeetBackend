const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Room = require("../models/roomModels");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc get all users
//@route GET /api/admin/getusers
//@access public

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: "User",
  });
  // console.log(users);
  res.json(users);
});

//@desc get all admins
//@route GET /api/admin/getadmins
//@access public
const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({
    role: "Admin",
  });
  res.json(admins);
});

//@desc get all admins
//@route GET /api/admin/getadmins
//@access public
const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

//@desc create a new room
//@route GET /api/admin/createRoom
//@access public
const createNewRoom = asyncHandler(async (req, res) => {
  const { roomId, description } = req.body;
  if (!roomId) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const roomExists = await Room.findOne({
    roomId,
  });
  if (roomExists) {
    res.status(400);
    throw new Error("Room already exists, Kindly create a new roomId");
  }
  const room = await Room.create({
    roomId,
    users: [],
    description,
  });
  if (room) {
    console.log("Room created");
    res.status(201).json({
      _id: room.id,
      roomId,
      users: room.users,
      description,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Delete a User
//@route DELETE /api/admin/deleteUser/:id
//@access public
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //first delete the User in corresponding Room
  const user = await User.findOne({ username: id });
  const room = await Room.findOneAndUpdate(
    { roomId: user.roomId },
    { $pull: { users: id } }
  );
  await User.findOneAndDelete({ username: id });
  res.json({
    message: "User Successfully Deleted",
  });
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const admin = await Admin.findOne({ username: id });
  console.log(admin.username);
  console.log(admin.roomId);
  for (const roomId in admin.roomId) {
    console.log(admin.roomId[roomId]);
    const room = await Room.findOne({roomId: admin.roomId[roomId]});
    // console.log(room.roomId);
    if (room) {
      console.log(room.roomId);
      for(const user in room.users){
        console.log(room.users[user]);
        await User.findOneAndDelete({username: room.users[user]});
        if(room.users[user] !== id){
          const admin = await Admin.findOne({ username: room.users[username] });
          if (admin) {
            for(const roomId in admin.roomId){
              console.log(admin.roomId[roomId]);
              if(admin.roomId[roomId]===id){
                var updated = admin.roomId.splice(roomId,1);
              //  await admin.save();
              }
             
            }
           
          }
        }
      }
      await Room.findOneAndDelete({ roomId: admin.roomId[roomId] });
      console.log("Room Deleted");
    } else {
      console.log("Room not found");
    }
  }
  await Admin.findOneAndDelete({ username: id });
  console.log("Admin Deleted");
  res.json({
    message: "Admin Successfully Deleted",
  });
});

//@desc Login the user
//@route POST /api/users/login
//@access public
const loginAdmin = asyncHandler(async (req, res) => {
  console.log("Logging in User");
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const admin = await Admin.findOne({ username });
  console.log(admin);
  if (admin && (await bcrypt.compare(password, admin.password))) {
    const accessToken = jwt.sign(
      {
        admin: {
          _id: admin._id,
          username: admin.username,
          name: admin.name,
          roomId: admin.roomId,
          role: admin.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(200).json({
      accessToken,
      username: admin.username,
      roomId: admin.roomId,
      role: admin.role,
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId: id });
  console.log("room found");
  console.log(room.users);
  for (username in room.users) {
    console.log(room.users[username]);
    await User.findOneAndDelete({ username: room.users[username] });
    const admin = await Admin.findOne({ username: room.users[username] });
    if (admin) {
      for(const roomId in admin.roomId){
        console.log(admin.roomId[roomId]);
        if(admin.roomId[roomId]===id){
          var updated = admin.roomId.splice(roomId,1);
        }
      }
      await admin.save();
    }
  }
  await Room.findOneAndDelete({ roomId: id });
  res.status(200).json({
    message: "Room Successfully Deleted",
  });
});

const addRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { roomId } = req.params;
  const admin = await Admin.findOne({ username: id });
  admin.roomId.push(roomId);
  await admin.save();
  res.status(200).json({
    message: "Room Successfully Added",
  });
});

const disableRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId: id });
  room.isDisabled = true;
  await room.save();
  res.status(200).json({
    message: "Room Successfully Disabled",
  });
});

const enableRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId: id });
  room.isDisabled = false;
  await room.save();
  res.status(200).json({
    message: "Room Successfully Disabled",
  });
});

const getAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findOne({ username: id });
  res.status(200).json({
    admin,
  });
});

const getRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId: id });
  res.status(200).json(
    room,
  );
});

module.exports = {
  getAllUsers,
  getAllAdmins,
  createNewRoom,
  getAllRooms,
  deleteUser,
  deleteAdmin,
  loginAdmin,
  deleteRoom,
  enableRoom,
  disableRoom,
  addRoom,
  getAdmin,
  getRoom,
};
