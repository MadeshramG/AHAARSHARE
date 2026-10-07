const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');

// Middleware - check if admin
function isAdmin(req, res, next) {
  if (!req.session.userId || req.session.userRole !== 'admin') {
    return res.redirect('/auth/login');
  }
  next();
}

// GET - Admin panel
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .populate('claimedBy', 'name')
      .sort({ createdAt: -1 });

    const stats = {
      totalUsers: users.length,
      totalDonors: users.filter(u => u.role === 'donor').length,
      totalNGOs: users.filter(u => u.role === 'ngo').length,
      totalDonations: donations.length,
      availableDonations: donations.filter(d => d.status === 'Available').length,
      claimedDonations: donations.filter(d => d.status === 'Claimed').length,
      deliveredDonations: donations.filter(d => d.status === 'Delivered').length,
      totalMealsSaved: donations.filter(d => d.status === 'Delivered').reduce((sum, d) => sum + d.servings, 0)
    };

    res.render('admin', {
      users,
      donations,
      stats,
      userRole: req.session.userRole,
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// POST - Delete user (admin only)
router.post('/users/:id/delete', isAdmin, async (req, res) => {
  try {
    // Don't allow admin to delete themselves
    if (req.params.id === req.session.userId.toString()) {
      return res.redirect('/admin');
    }

    await User.findByIdAndDelete(req.params.id);
    // Also delete their donations
    await Donation.deleteMany({ donor: req.params.id });

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// POST - Delete donation (admin)
router.post('/donations/:id/delete', isAdmin, async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

module.exports = router;
