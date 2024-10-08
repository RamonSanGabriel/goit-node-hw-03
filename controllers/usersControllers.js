import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import { User } from '../models/usersModel.js';
import { httpError } from '../helpers/httpError.js';
import {
  signUpValidation,
  subscriptionValidation,
  emailValidation,
} from '../validations/validations.js';
import { sendEmail } from '../helpers/sendEmail.js';
import { v4 as uuid4 } from 'uuid';

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  // Registration validation error
  const { error } = signUpValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  // Registration conflict error
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Create a link to the user's avatar wth gravatar
  const avatarURL = gravatar.url(email, { protocol: 'http' });
  // Create a verificationToken for the user
  const verificationToken = uuid4();
  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  // Send a verification email to the user
  await sendEmail({
    to: email,
    subject: 'Action Required: verify your email',
    html: `<a target="blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  });
  // Registration success response
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
      verificationToken,
    },
  });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Login validation error
  const { error } = signUpValidation.validate(req.body);
  if (error) {
    throw httpError(401, error.message);
  }

  // Login auth error (email)
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, 'Email or Password is wrong');
  }

  // Login auth error (password)
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw httpError(401, 'Email or Password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  await User.findByIdAndUpdate(user._id, { token });

  // Login success response
  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
const logoutUser = async (req, res) => {
  const { _id } = req.user;

  // Logout unauthorized error (setting token to empty string will remove token -> will logout)
  await User.findByIdAndUpdate(_id, { token: '' });

  // Logout success response
  res.status(204).send();
};
const getCurrentUsers = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};
const updateUserSubscription = async (req, res) => {
  const { error } = subscriptionValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const { _id } = req.user;

  const updateUser = await User.findByIdAndUpdate(_id, req.body, { new: true });

  res.json({
    email: updateUser.email,
    subscription: updateUser.subscription,
  });
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  await Jimp.read(oldPath).then((image) =>
    image.cover(250, 250).write(oldPath)
  );

  const extension = path.extname(originalname);
  const filename = `${_id}${extension}`;

  // Image will be transfer from tmp folder to Public/avatars folder
  const newPath = path.join('public', 'avatars', filename);
  await fs.rename(oldPath, newPath);

  // const avatarURL = path.join('/avatars', filename);
  let avatarURL = path.join('/avatars', filename);

  // /avatars/ramon.jpg - for window users only
  // \\avatars\ramon.jpg - windows format
  avatarURL = avatarURL.replace(/\\/g, '/');

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  // Verification user Not Found
  if (!user) {
    throw httpError(400, 'User not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  // Verification success response
  res.json({ message: 'Verification successful' });
};
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  // Resending an email validation error
  const { error } = emailValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(404, 'The provided email address could not be found');
  }
  // Resend email for verified user
  if (user.verify) {
    throw httpError(400, 'Email is already verified');
  }
  await sendEmail({
    to: email,
    subject: 'Action required: Verify your email',
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}" >Click to verify email<a/>`,
  });
  // Resending an email success response
  res.json({ message: 'Verification email sent' });
};
// prettier-ignore
export { signupUser, loginUser, logoutUser, getCurrentUsers, updateAvatar, updateUserSubscription, verifyEmail, resendVerifyEmail };
