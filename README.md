# 🍛 AaharShare — Share Food, Share Hope

**AaharShare** is a Progressive Web App (PWA) that connects surplus food donors with NGOs and shelters, reducing food waste and saving meals for those in need.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏪 **Donor Portal** | Post surplus food with details like type, quantity, servings, and pickup address |
| 🤝 **NGO Dashboard** | Browse available donations, claim food, and track pickup/delivery status |
| ⚙️ **Admin Panel** | Manage users and donations, view platform-wide statistics |
| 📱 **PWA Support** | Installable on mobile devices with offline caching for static assets |
| 🔐 **Auth System** | Secure registration & login with bcrypt password hashing and sessions |
| 📊 **Live Stats** | Track meals saved, donations available, claimed, picked up, and delivered |

---

## 🚀 Tech Stack

- **Backend:** Node.js + Express 5
- **Database:** MongoDB + Mongoose ODM
- **Templating:** EJS
- **Auth:** bcryptjs + express-session
- **Frontend:** Vanilla CSS (dark theme, mobile-first design)
- **PWA:** Service Worker + Web App Manifest

---

## 📂 Project Structure

```
AHAARSHARE/
├── models/
│   ├── Donation.js        # Donation schema
│   └── User.js            # User schema with password hashing
├── routes/
│   ├── auth.js            # Login / Register / Logout
│   ├── donations.js       # CRUD + Claim/Pickup/Deliver
│   └── admin.js           # Admin panel & user management
├── views/
│   ├── partials/
│   │   ├── pwa-head.ejs   # PWA meta tags
│   │   └── pwa-script.ejs # Service Worker registration
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── donations.ejs
│   ├── donation-form.ejs
│   └── admin.ejs
├── public/
│   ├── css/style.css      # Full stylesheet (dark theme)
│   ├── icons/icon-512.png # App icon
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service Worker
├── server.js              # Express app entry point
├── seed.js                # Admin account seeder
├── package.json
└── .env                   # Environment variables (not committed)
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/MADESHRAM/AHAARSHARE.git
cd AHAARSHARE
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/aaharshare
SESSION_SECRET=your_secret_key_here
PORT=3000
```

### 4. Seed the admin account
```bash
node seed.js
```
> **Default Admin Credentials:** `admin@aaharshare.com` / `admin123`

### 5. Start the server
```bash
npm start
```

Open **http://localhost:3000** in your browser.

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Donor** | Create, edit, delete food donations |
| **NGO / Volunteer** | Browse donations → Claim → Mark Picked Up → Mark Delivered |
| **Admin** | View all users & donations, delete any user or donation |

---

## 📱 Donation Lifecycle

```
Available → Claimed → Picked Up → Delivered
   🟢          🟡          🔵          ✅
```

1. **Donor** posts surplus food (status: Available)
2. **NGO** claims the donation (status: Claimed)
3. **NGO** picks up the food (status: Picked Up)
4. **NGO** delivers to beneficiaries (status: Delivered)

---

## 🎨 Screenshots

The app features a premium dark theme with:
- Glassmorphic navigation bars
- Gradient accent colors (Orange → Teal)
- Smooth slide-up animations
- Mobile-first responsive design
- Bottom navigation bar (mobile app feel)

---

## 📄 License

ISC

---

> Made with ❤️ to reduce food waste and feed the hungry.
