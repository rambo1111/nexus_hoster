const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

// --- Helper to generate JWT cookie ---
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// --- Register a new user ---
exports.registerUser = async (req, res) => {
  const { displayName, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const user = await User.create({ displayName, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      profilePicture: user.profilePicture
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// --- Login an existing user ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      profilePicture: user.profilePicture
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// --- Logout user ---
exports.logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

// --- Get current user profile ---
exports.getCurrentUser = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      profilePicture: req.user.profilePicture
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- Upload Profile Picture ---
exports.uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const avatarUrl = `/api/auth/avatar/${req.file.filename}`;
      user.profilePicture = avatarUrl;
      await user.save();
      res.json({
        message: 'Profile picture uploaded successfully',
        profilePicture: avatarUrl
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during picture upload' });
  }
};
