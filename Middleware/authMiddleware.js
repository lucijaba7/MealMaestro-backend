import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import User from "../schemas/userSchema";
import Avatar from "../schemas/avatarSchema";
import { promisify } from "util";
import jwt from "jsonwebtoken";

exports.signup = asyncHandler(async (req, res, next) => {
  let avatar = await Avatar.find({
    url: req.body.avatar,
  });

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    password_confirm: req.body.password_confirm,
    preferences: req.body.preferences,
    servings: req.body.servings,
    avatar: avatar[0],
  });
  createToken(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required", 400));
  }
  const user = await User.findOne({
    $or: [{ email }, { username: email }],
  }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new ErrorHandler("Email or password are incorrect", 401));
  }
  createToken(user, 200, res);
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // 1) Get token and check if exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("You are not logged in", 401)); // 401 = unauthorized
  }

  // 2) Validate token (Verification)
  const decoded_payload = await promisify(
    jwt.verify(token, process.env.JWT_SECRET)
  ); //promisify returns a promise (verify is async.)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ErrorHandler("User with this token no longer exists", 401));
  }
  // 4) Check i f user changed password after token was issued
  if (currentUser.hasChangedPassword(decoded.iat)) {
    //iat = timestamp
    return next(new ErrorHandler("Password changed, log in again.", 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

//// TOKENI ----------------------------------
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookie_options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure: true, activate in production
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  };
  //if (process.env.NODE_ENV === "production") cookie_options.secure = true;

  res.cookie("jwt", token, cookie_options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
