import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../models/usersModel.js';
import { httpError } from '../helpers/httpError.js';
import { signUpValidation } from '../validations/validations.js';

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

  const newUser = await User.create({ email, password: hashPassword });

  // Registration success response
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
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

// prettier-ignore
export { signupUser, loginUser, logoutUser, getCurrentUsers };
