const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getCurrentUser, uploadProfilePicture } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { uploadAvatar } = require('../config/storage.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);

// New route for uploading avatar, protected and using the avatar upload middleware
router.post(
  '/profile-picture', 
  protect, 
  uploadAvatar.single('avatar'), 
  uploadProfilePicture
);

module.exports = router;
