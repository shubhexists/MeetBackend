const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Room = require("../models/roomModels");
const Admin = require("../models/adminModel");
const Announcement = require("../models/announcementModel");
const Owner = require("../models/ownerModel");
const jwt = require("jsonwebtoken");
const LokiTransport = require("winston-loki");
const { createLogger } = require("winston");

const logger = createLogger({
  transports: [
    new LokiTransport({
      host: "http://localhost:3100",
    }),
  ],
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: "User",
  });
  res.json(users);
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({
    role: "Admin",
  });
  res.json(admins);
});

const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

const createNewRoom = asyncHandler(async (req, res) => {
  const { roomId, password, description } = req.body;
  logger.info(`Request to create room ${roomId}`);
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
    password,
    users: [],
    description,
  });
  const user = await User.create({
    username: roomId,
    password: password,
    name: roomId,
    roomId,
    role: "Host",
    deviceInfo: "",
  });
  const hmm = await Room.findOneAndUpdate(
    { roomId: roomId },
    {
      $push: { users: roomId },
    },
    {
      new: true,
    }
  );

  const an = await Announcement.create({
    roomId,
    message: " ",
  });

  if (room) {
    logger.info(`Room Created ${roomId}`);
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

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  const room = await Room.findOneAndUpdate(
    { roomId: user.roomId },
    { $pull: { users: id } }
  );
  await User.findOneAndDelete({ username: id });
  logger.info(`User Deleted ${id}`);
  res.json({
    message: "User Successfully Deleted",
  });
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Request to delete Admin - ${id}`);
  const admin = await Admin.findOne({ username: id });
  for (const roomId in admin.roomId) {
    const room = await Room.findOne({ roomId: admin.roomId[roomId] });
    if (room) {
      for (const user in room.users) {
        await User.findOneAndDelete({ username: room.users[user] });
      }
      await Room.findOneAndDelete({ roomId: admin.roomId[roomId] });
      await Announcement.findOneAndDelete({ roomId: admin.roomId[roomId] });
    } else {
    }
  }
  await Admin.findOneAndDelete({ username: id });
  logger.info(`Admin ${id} deleted successfully`);
  res.json({
    message: "Admin Successfully Deleted",
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  //CHANGE - If not admin, then check if it a owner
  const { username, password } = req.body;
  logger.info(`Admin ${username} is requesting login`);
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const admin = await Admin.findOne({ username });
  if (!admin) {
    const owner = await Owner.findOne({ ownerId: username });
    if (!owner) {
      res.status(401);
      throw new Error("Invalid username or password");
    } else {
      if (owner && password === owner.password) {
        const accessToken = jwt.sign(
          {
            owner: {
              _id: owner._id,
              ownerId: owner.ownerId,
              ownerName: owner.ownerName,
              role: owner.role,
              limitOfAdmin: owner.limitOfAdmin,
            },
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
          accessToken,
          ownerId: owner.ownerId,
          ownerName: owner.ownerName,
          role: owner.role,
          limitOfAdmin: owner.limitOfAdmin,
        });
      } else {
        res.status(401);
        throw new Error("Invalid username or password");
      }
    }
  } else {
    if (admin.isDisabled) {
      res.status(201);
      throw new Error("You are disabled, Kindly contact the Owner.");
    } else {
      if (admin && password === admin.password) {
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
          name: admin.name,
          roomId: admin.roomId,
          role: admin.role,
        });
      } else {
        res.status(401);
        throw new Error("Invalid username or password");
      }
    }
  }
});

const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Request to delete Room ${id}`);
  const room = await Room.findOne({ roomId: id });
  for (username in room.users) {
    await User.findOneAndDelete({ username: room.users[username] });
    const admin = await Admin.findOne({ username: room.users[username] });
    if (admin) {
      for (const roomId in admin.roomId) {
        if (admin.roomId[roomId] === id) {
          var updated = admin.roomId.splice(roomId, 1);
        }
      }
      await admin.save();
    }
  }
  await Announcement.findOneAndDelete({ roomId: id });
  await Room.findOneAndDelete({ roomId: id });
  logger.info(`Room ${id} deleted successfully`);
  res.status(200).json({
    message: "Room Successfully Deleted",
  });
});

const addRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { roomId } = req.params;
  logger.info(`Request to add Room ${roomId} to Admin ${id}`);
  const admin = await Admin.findOne({ username: id });
  admin.roomId.push(roomId);
  await admin.save();
  const room = await Room.findOne({ roomId });
  room.users.push(id);
  await room.save();
  logger.info(`Room ${roomId} added to Admin ${id}`);
  res.status(200).json({
    message: "Room Successfully Added",
  });
});

const disableRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findOne({ roomId });
  room.isDisabled = true;
  await room.save();
  logger.info(`Room ${roomId} disabled !`);
  res.status(200).json({
    message: "Room Successfully Disabled",
  });
});

const enableRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId: id });
  room.isDisabled = false;
  await room.save();
  logger.info(`Room ${id} enabled !`);
  res.status(200).json({
    message: "Room Successfully Enabled",
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
  res.status(200).json(room);
});

const newAnnouncement = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { announcement } = req.body;
  const room = await Announcement.findOne({ roomId });
  if (room) {
    room.message = announcement;
    await Announcement.findOneAndUpdate({ roomId }, { message: announcement });
    logger.info(`Announcement Updated in ${roomId}`);
    res.status(200).json({
      message: "Announcement Updated",
    });
  } else {
    res.status(404);
    throw new Error("Room not found");
  }
});

const changeAdminPassword = asyncHandler(async (req, res) => {
  const { userId, password, newPassword } = req.body;
  const admin = await Admin.findOne({ username: userId });
  if (admin && password === admin.password) {
    await Admin.findOneAndUpdate(
      { username: userId },
      { password: newPassword }
    );
    logger.info(`Admin ${userId}'s password changed to ${newPassword}`);
    res.status(200).json({
      message: "Password Updated",
    });
  } else {
    res.status(401);
    logger.info(`Admin ${userId}'s password change failed`);
    throw new Error("Invalid username or password");
  }
});

const setHostInRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const host = await Room.findOneAndUpdate(
    { roomId },
    {
      isHostIn: true,
    }
  );
  logger.info(`Host ${roomId} in room`);
  res.status(200).json({
    message: "Host In The Room",
  });
});

const setHostOutRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const host = await Room.findOneAndUpdate(
    { roomId },
    {
      isHostIn: false,
    }
  );
  logger.info(`Host ${roomId} out of room`);
  res.status(200).json({
    message: "Host Out The Room",
  });
});

const setUserDisabled = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate(
    { username: userId },
    { isDisabled: true }
  );
  logger.info(`User ${userId} disabled`);
  res.status(200).json({
    message: "User Disabled",
  });
});

const setUserEnabled = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate(
    { username: userId },
    { isDisabled: false }
  );
  logger.info(`User ${userId} enabled`);
  res.status(200).json({
    message: "User Enabled",
  });
});

const setIsMuted = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate(
    { username: userId },
    { isMuted: true }
  );
  logger.info(`User ${userId} muted`);
  res.status(200).json({
    message: "User is Muted",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  res.status(200).json({ user });
});

const setIsUnmuted = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate(
    { username: userId },
    {
      isMuted: false,
    }
  );
  logger.info(`User ${userId} unmuted`);
  res.status(200).json({
    message: "User is Unmuted",
  });
});

const setAudioSubscribed = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate(
    {
      username: userId,
    },
    {
      isAudioSubscribed: true,
    }
  );
  logger.info(`User ${userId} subscribed audio`);
  res.status(200).json({
    message: "Audio Subscribed",
  });
});

const setAudioUnSubscribed = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate(
    {
      username: userId,
    },
    {
      isAudioSubscribed: false,
    }
  );
  logger.info(`User ${userId} unsubscribed audio`);
  res.status(200).json({
    message: "Audio Unsubscribed",
  });
});

const changeRoomPassword = asyncHandler(async (req, res) => {
  const { roomId, newPassword } = req.body;
  const room = await Room.findOne({ roomId: roomId });
  room.password = newPassword;
  await room.save();
  const host = await User.findOne({ username: roomId });
  host.password = newPassword;
  await host.save();
  logger.info(`Room ${roomId}'s password changed to ${newPassword}`);
  res.status(200).json({
    message: "Password Updated",
  });
});

const disableAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findOne({ username: id });
  var rooms = admin.roomId;
  for (const roomId in rooms) {
    const room = await Room.findOne({ roomId: rooms[roomId] });
    room.isDisabled = true;
    await room.save();
  }
  admin.isDisabled = true;
  await admin.save();
  logger.info(`Admin ${id} disabled !`);
  res.status(200).json({
    message: "Admin Successfully Disabled",
  });
});

const enableAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findOne({ username: id });
  var rooms = admin.roomId;
  for (const roomId in rooms) {
    const room = await Room.findOne({ roomId: rooms[roomId] });
    room.isDisabled = false;
    await room.save();
  }
  admin.isDisabled = false;
  await admin.save();
  logger.info(`Admin ${id} enabled !`);
  res.status(200).json({
    message: "Admin Successfully Disabled",
  });
});

const getSocketData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: id });
  res.status(200).json({
    username: id,
    muted: user.isMuted,
    speaking: user.isSpeaking,
  });
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;
  const user = await User.findOne({ username: userId });
  user.password = newPassword;
  await user.save();
  logger.info(`User ${userId}'s password changed to ${newPassword}`);
  res.status(200).json({
    message: "Password Updated",
  });
});

const adminPassByOwner = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;
  const admin = await Admin.findOne({ username: userId });
  admin.password = newPassword;
  await admin.save();
  logger.info(`Admin ${userId}'s password changed by Owner`);
  res.status(200).json({
    message: "Password Updated",
  });
});

const changeUserName = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;
  const user = await User.findOne({ username: id });
  user.name = newName;
  await user.save();
  logger.info(`User ${id}'s name changed to ${newName}`);
  res.status(200).json({
    message: "Name Updated",
  });
});

const changeAdminName = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;
  const admin = await Admin.findOne({ username: id });
  admin.name = newName;
  await admin.save();
  logger.info(`Admin ${id}'s name changed to ${newName}`);
  res.status(200).json({
    message: "Name Updated",
  });
});

const searchUsersByUserName = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const searchString = "^" + id;
  const regex = new RegExp(searchString, "i");
  const users = await User.find({
    name: { $regex: regex },
    role: "User",
  });
  res.json(users);
});

const searchUsersByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const searchString = "^" + id;
  const regex = new RegExp(searchString, "i");
  const users = await User.find({
    username: { $regex: regex },
    role: "User",
  });
  res.json(users);
});

const getIdFromName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const user = await User.findOne({
    name: name,
  });
  res.json(user);
});

module.exports = {
  searchUsersByUserName,
  getAllUsers,
  getAllAdmins,
  searchUsersByUserId,
  createNewRoom,
  getAllRooms,
  changeUserName,
  changeAdminName,
  deleteUser,
  deleteAdmin,
  getSocketData,
  loginAdmin,
  deleteRoom,
  enableRoom,
  disableRoom,
  addRoom,
  getAdmin,
  getUser,
  getRoom,
  newAnnouncement,
  changeAdminPassword,
  setHostInRoom,
  changeRoomPassword,
  setHostOutRoom,
  setUserDisabled,
  setUserEnabled,
  setIsMuted,
  setIsUnmuted,
  setAudioSubscribed,
  setAudioUnSubscribed,
  enableAdmin,
  disableAdmin,
  adminPassByOwner,
  changeUserPassword,
  getIdFromName,
};
