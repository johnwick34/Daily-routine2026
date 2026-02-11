// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile); // Protected route

module.exports = router;