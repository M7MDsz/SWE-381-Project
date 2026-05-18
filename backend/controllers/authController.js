const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const sendUserResponse = (res, user, statusCode) => {
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['owner', 'user'].includes(role)) {
      res.status(400);
      throw new Error('Role must be owner or user');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Email already registered');
    }

    const user = await User.create({ name, email, password, role });
    sendUserResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return sendUserResponse(res, user, 200);
    }

    res.status(401);
    throw new Error('Invalid email or password');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getProfile };
