const asyncHandler = require("express-async-handler");
const checkOwner = asyncHandler(async (req, res, next) => {
  const userRoles = req.user.role;

  if (userRoles && userRoles.includes("Owner")) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Forbidden: Only the Owner can access this route." });
  }
});

module.exports = checkOwner;