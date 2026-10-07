const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Middleware - check if logged in
function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
}

// GET - All donations (feed for NGOs)
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name phone organization')
      .populate('claimedBy', 'name organization')
      .sort({ createdAt: -1 });

    res.render('donations', {
      donations,
      userRole: req.session.userRole,
      userName: req.session.userName,
      userId: req.session.userId
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// GET - New donation form (donors only)
router.get('/new', isLoggedIn, (req, res) => {
  if (req.session.userRole !== 'donor') {
    return res.redirect('/donations');
  }
  res.render('donation-form', {
    donation: null,
    userRole: req.session.userRole,
    userName: req.session.userName,
    error: null
  });
});

// POST - Create donation
router.post('/', isLoggedIn, async (req, res) => {
  try {
    if (req.session.userRole !== 'donor') {
      return res.redirect('/donations');
    }

    const { foodName, foodType, quantity, servings, cookedAt, pickupAddress, contactPhone, description } = req.body;

    const donation = new Donation({
      donor: req.session.userId,
      foodName,
      foodType,
      quantity,
      servings: parseInt(servings),
      cookedAt,
      pickupAddress,
      contactPhone,
      description
    });

    await donation.save();
    res.redirect('/donations');
  } catch (err) {
    console.error(err);
    res.render('donation-form', {
      donation: null,
      userRole: req.session.userRole,
      userName: req.session.userName,
      error: 'Failed to create donation. Please try again.'
    });
  }
});

// GET - Edit donation form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.redirect('/donations');

    // Only the donor who created it can edit, and only if still Available
    if (donation.donor.toString() !== req.session.userId.toString() || donation.status !== 'Available') {
      return res.redirect('/donations');
    }

    res.render('donation-form', {
      donation,
      userRole: req.session.userRole,
      userName: req.session.userName,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/donations');
  }
});

// POST - Update donation
router.post('/:id', isLoggedIn, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.redirect('/donations');

    if (donation.donor.toString() !== req.session.userId.toString() || donation.status !== 'Available') {
      return res.redirect('/donations');
    }

    const { foodName, foodType, quantity, servings, cookedAt, pickupAddress, contactPhone, description } = req.body;

    donation.foodName = foodName;
    donation.foodType = foodType;
    donation.quantity = quantity;
    donation.servings = parseInt(servings);
    donation.cookedAt = cookedAt;
    donation.pickupAddress = pickupAddress;
    donation.contactPhone = contactPhone;
    donation.description = description;

    await donation.save();
    res.redirect('/donations');
  } catch (err) {
    console.error(err);
    res.redirect('/donations');
  }
});

// POST - Delete donation
router.post('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.redirect('/donations');

    // Donor can delete their own, admin can delete any
    const isDonor = donation.donor.toString() === req.session.userId.toString();
    const isAdmin = req.session.userRole === 'admin';

    if (!isDonor && !isAdmin) {
      return res.redirect('/donations');
    }

    await Donation.findByIdAndDelete(req.params.id);
    res.redirect('/donations');
  } catch (err) {
    console.error(err);
    res.redirect('/donations');
  }
});

// POST - Claim donation (NGO only)
router.post('/:id/claim', isLoggedIn, async (req, res) => {
  try {
    if (req.session.userRole !== 'ngo') {
      return res.redirect('/donations');
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.status !== 'Available') {
      return res.redirect('/donations');
    }

    donation.status = 'Claimed';
    donation.claimedBy = req.session.userId;
    donation.claimedAt = new Date();
    await donation.save();

    res.redirect('/donations');
  } catch (err) {
    console.error(err);
    res.redirect('/donations');
  }
});

// POST - Mark as Picked Up (NGO who claimed it)
router.post('/:id/pickup', isLoggedIn, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.status !== 'Claimed') {
      return res.redirect('/donations');
    }

    if (donation.claimedBy.toString() !== req.session.userId.toString()) {
      return res.redirect('/donations');
    }

    donation.status = 'Picked Up';
    donation.pickedUpAt = new Date();
    await donation.save();

    res.redirect('/donations');
  } catch (err) {
    console.error(err);
    res.redirect('/donations');
  }
});

// POST - Mark as Delivered (NGO who claimed it)
router.post('/:id/deliver', isLoggedIn, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.status !== 'Picked Up') {
      return res.redirect('/donations');
    }

    if (donation.claimedBy.toString() !== req.session.userId.toString()) {
      return res.redirect('/donations');
    }

    donation.status = 'Delivered';
    donation.deliveredAt = new Date();
    await donation.save();

    res.redirect('/donations');
  } catch (err) {
    console.error(err);
    res.redirect('/donations');
  }
});

module.exports = router;
