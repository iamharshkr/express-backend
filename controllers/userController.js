const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// Register a User
/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details and generates an authentication token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user account.
 *               number:
 *                 type: number
 *                 description: The phone number of the user.
 *     responses:
 *       '201':
 *         description: User successfully registered. Returns the user details and authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 user:
 *                   type: object
 *                   description: The registered user's details.
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     number:
 *                       type: number
 *                 token:
 *                   type: string
 *                   description: Authentication token for the registered user.
 *       '500':
 *         description: Internal Server Error. Failed to register user.
 */

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, number } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    number,
  });

  sendToken(user, 201, res);
});

// Login User
/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user with the provided email and password, and generates an authentication token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user account.
 *     responses:
 *       '200':
 *         description: User successfully logged in. Returns the user details and authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 user:
 *                   type: object
 *                   description: The logged-in user's details.
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     number:
 *                       type: number
 *                     createdAt:
 *                      type: string
 *                 token:
 *                   type: string
 *                   description: Authentication token for the logged-in user.
 *       '400':
 *         description: Bad Request. Please provide both email and password.
 *       '401':
 *         description: Unauthorized. Invalid email or password.
 *       '500':
 *         description: Internal Server Error. Failed to log in user.
 */

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout User
/**
 * @swagger
 * /api/v1/logout:
 *   get:
 *     summary: Logout a user
 *     description: Clears the authentication token cookie, logging out the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       '200':
 *         description: User successfully logged out. Authentication token cookie cleared.
 *       '500':
 *         description: Internal Server Error. Failed to log out user.
 */

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
