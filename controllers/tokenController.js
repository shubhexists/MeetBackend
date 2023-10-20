const asyncHandler = require("express-async-handler");
const { AccessToken } = require("livekit-server-sdk");
const dotenv = require("dotenv").config();
const LokiTransport = require("winston-loki");
const { createLogger } = require("winston");

const logger = createLogger({
  transports: [
    new LokiTransport({
      host: "http://localhost:3100",
    }),
  ],
});

const generateMeetingToken = asyncHandler(async (req, res) => {
  const { identity, room } = req.body;
  if (!identity || !room) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: identity,
    },
  );

  token.addGrant({
    roomJoin: true,
    room: room,
  });
  logger.info(`Meeting token generated for ${identity}`)
  res.status(200).json({ token: token.toJwt() });
});

const generateAdminToken = asyncHandler(async (req, res) => {
  const { identity, room } = req.body;
  if (!identity || !room) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: identity,
    },
  );

  token.addGrant({
    roomJoin: true,
    room: room,
    roomAdmin: true,
    roomCreate: true,
  });
  logger.info(`Admin token generated for ${identity}`)
  res.status(200).json({ token: token.toJwt() });
});

const generateRecordingToken = asyncHandler(async (req, res) => {
  const { identity, room } = req.body;
  if (!identity || !room) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: identity,
    },
  );
  token.addGrant({
    roomJoin: true,
    room: room,
    roomRecord: true,
  });
  logger.info(`Recording token generated for ${identity}`)
  res.status(200).json({ token: token.toJwt() });
});

module.exports = {
  generateMeetingToken,
  generateAdminToken,
  generateRecordingToken,
};
