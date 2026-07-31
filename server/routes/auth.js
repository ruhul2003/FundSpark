const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_crowdfund_2026_safe',
    { expiresIn: '7d' }
  );
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, photoURL, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const userRole = role === 'Creator' ? 'Creator' : role === 'Admin' ? 'Admin' : 'Supporter';
    let initialCredits = 0;
    if (userRole === 'Supporter') initialCredits = 50;
    if (userRole === 'Creator') initialCredits = 20;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      photoURL: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      role: userRole,
      credits: initialCredits
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        credits: user.credits,
        raisedCredits: user.raisedCredits
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        credits: user.credits,
        raisedCredits: user.raisedCredits
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Sign In (Handles both JWT credential & direct payload)
router.post('/google-login', async (req, res) => {
  try {
    let { email, name, photoURL, credential, role } = req.body;

    if (credential) {
      const decoded = jwt.decode(credential);
      if (decoded) {
        email = decoded.email;
        name = decoded.name || decoded.given_name || 'Google User';
        photoURL = decoded.picture || photoURL;
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'Google account email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const userRole = role === 'Creator' ? 'Creator' : 'Supporter';
      const initialCredits = userRole === 'Supporter' ? 50 : 20;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(`GoogleAuthPass_${Date.now()}_${Math.random()}`, salt);

      user = new User({
        name: name || 'Google User',
        email: normalizedEmail,
        password: hashedPassword,
        photoURL: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: userRole,
        credits: initialCredits
      });
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        credits: user.credits,
        raisedCredits: user.raisedCredits
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Current User Profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
