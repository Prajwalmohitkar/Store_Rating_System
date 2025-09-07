const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/).withMessage('Password must be 8-16 chars, include 1 uppercase & 1 special character.'),
  body('address').isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters.'),
], register);

router.post('/login', login);
router.put('/update-password', protect, updatePassword);

module.exports = router;
