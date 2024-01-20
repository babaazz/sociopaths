import jwt from "jsonwebtoken";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Register User

export const register = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    picturePath,
    friends,
    location,
    occupation,
  } = req.body;

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    picturePath,
    friends,
    location,
    occupation,
    viewedProfile: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 1000),
  });

  newUser.password = undefined;

  res.status(201).json({
    status: "Success",
    data: {
      user: newUser,
    },
  });
});

//Login
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    throw new AppError("User doesn't exist", 400);
  }

  const isMatch = await user.isPasswordMatched(password, user.password);
  if (!isMatch) {
    throw new AppError("Email or password is wrong", 401);
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "700s" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { refreshToken: refreshToken } },
    { new: true }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: "Success",
    accessToken,
    data: {
      user: loggedInUser,
    },
  });
});
