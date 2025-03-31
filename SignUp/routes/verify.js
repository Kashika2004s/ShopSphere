const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust path based on your project structure
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user does not exist' });
    }

    // Update the user's isVerified field to true
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
