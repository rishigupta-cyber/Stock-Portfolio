const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('profile', { user, success: null, error: null });
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const taken = await User.findOne({ email, excludeId: req.session.userId });
    if (taken) {
      const user = await User.findById(req.session.userId);
      return res.render('profile', { user, error: 'This email belongs to another account!', success: null });
    }

    await User.findByIdAndUpdate(req.session.userId, { name, email });
    const user = await User.findById(req.session.userId);
    res.render('profile', { user, success: 'Profile updated successfully!', error: null });

  } catch {
    const user = await User.findById(req.session.userId);
    res.render('profile', { user, error: 'Update failed. Try again.', success: null });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.session.userId);
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.render('profile', { user, error: 'Current password is incorrect!', success: null });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.render('profile', { user, success: 'Password changed successfully!', error: null });

  } catch {
    const user = await User.findById(req.session.userId);
    res.render('profile', { user, error: 'Password change failed.', success: null });
  }
};