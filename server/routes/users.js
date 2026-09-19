const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/roleAuth');

// GET All Users (Admin)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE User (Admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'Admin' && user.email === 'admin@crowdspark.com') {
      return res.status(400).json({ message: 'Cannot delete primary Admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH Update User Role (Admin)
router.patch('/:id/role', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Admin', 'Creator', 'Supporter'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: `Role updated to ${role}`, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT Update User Profile (Self)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, photoURL, bio, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name.trim();
    if (photoURL !== undefined) user.photoURL = photoURL;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        credits: user.credits,
        raisedCredits: user.raisedCredits,
        bio: user.bio,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT Change Password (Self)
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
