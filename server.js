require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aaharshare')
  .then(() => console.log('✅ Connected to MongoDB - aaharshare database'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Middleware =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'aaharshare_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// ===== Import Models =====
const Donation = require('./models/Donation');

// ===== Import Routes =====
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');

// ===== Root Route - Redirect =====
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

// ===== Dashboard Route =====
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    const stats = {
      available: donations.filter(d => d.status === 'Available').length,
      claimed: donations.filter(d => d.status === 'Claimed').length,
      pickedUp: donations.filter(d => d.status === 'Picked Up').length,
      delivered: donations.filter(d => d.status === 'Delivered').length
    };

    const totalMealsSaved = donations
      .filter(d => d.status === 'Delivered')
      .reduce((sum, d) => sum + d.servings, 0);

    const recentDonations = donations.slice(0, 5);

    res.render('dashboard', {
      userName: req.session.userName,
      userRole: req.session.userRole,
      stats,
      totalMealsSaved,
      recentDonations
    });
  } catch (err) {
    console.error(err);
    res.redirect('/auth/login');
  }
});

// ===== Mount Routes =====
app.use('/auth', authRoutes);
app.use('/donations', donationRoutes);
app.use('/admin', adminRoutes);

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).send(`
    <div style="text-align:center; padding:60px; font-family:Inter,sans-serif; background:#0F1923; color:#F0F4F8; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center;">
      <h1 style="font-size:4rem; margin-bottom:10px;">404</h1>
      <p style="color:#8899AA; margin-bottom:20px;">Page not found</p>
      <a href="/dashboard" style="color:#FF6B35; text-decoration:none; font-weight:600;">← Go to Dashboard</a>
    </div>
  `);
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`\n🍛 AaharShare is running!`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
  console.log(`📦 Database: aaharshare (MongoDB)\n`);
});
