const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Room = require("../models/roomModels") 
//@desc get all users
//@route GET /api/admin/getusers
//@access public

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({
        role: "User",
    });
    console.log(users);
    res.json(users);
    }
);

//@desc get all admins
//@route GET /api/admin/getadmins
//@access public
const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await User.find({
        role: "Admin",
    });
    res.json(admins);
    }
);

//@desc get all admins
//@route GET /api/admin/getadmins
//@access public
const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
  }
);

//@desc create a new room
//@route GET /api/admin/createRoom
//@access public
const createNewRoom = asyncHandler(async (req,res) => {
  const { roomId, roomDescription } = req.body;
  if(!roomId){
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const roomExists = await Room.findOne({
    roomId
  });
  if(roomExists){
    res.status(400);
    throw new Error("Room already exists, Kindly create a new roomId")
  }
    const room = await Room.create(
        {
            roomId,
            users:[],
            roomDescription
        }
    );
    if (room) {
        console.log("Room created");
        res
          .status(201)
          .json({
            _id:room.id,
            roomId,
            users:room.users,
            roomDescription
          });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }

})

module.exports = {getAllUsers, getAllAdmins,createNewRoom, getAllRooms};