import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";

export const verifyToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) res.status(403).send("Access Denied");

  const accessToken = authHeader.split(" ")[1];

  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    throw new Error("User no longer exist");
  }

  if (currentUser.hasPasswordChangedAfterLastLogin(decoded.iat)) {
    throw new Error("Password has been changed after last login");
  }

  req.user = currentUser;
  next();
});
