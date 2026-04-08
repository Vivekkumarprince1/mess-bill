# 🍽️ Canteen Management & Anti-Fraud System

**Advanced full-stack solution for transparent digital billing in college/hostel canteens with real-time fraud prevention and role-based access control.**

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)
![React](https://img.shields.io/badge/React-18+-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-brightgreen?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-blue?style=flat-square)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)

---

## 🎯 Overview

This system eliminates billing fraud in canteen operations by:
- ✅ **Requiring explicit student consent** before any charge
- ✅ **Immutable transaction logs** with full timestamp
- ✅ **Role-based access control** (Students, Vendors, Admins)
- ✅ **Real-time updates** via Socket.io
- ✅ **Dispute resolution** workflows
- ✅ **Admin approval** required for all price changes

---

## ✨ Core Features

### 🎓 Student Dashboard
- Browse approved menu items
- Place order requests (manual auth required)
- Real-time order status tracking
- View transaction history with Item-wise breakdown
- Dispute charges with reasons
- Running monthly bill

### 🏪 Vendor Dashboard
- Propose new menu items
- Real-time pending student request queue
- Confirm & dispense orders
- Submit price change requests
- View counter transaction history

### 👔 Admin Dashboard
- Approve/reject menu proposals
- Monitor disputed transactions
- View system-wide audit logs
- Manage price change requests
- Analytics dashboard

### 🔐 Anti-Fraud Safeguards
- **No auto-billing** - Orders created only by explicit student request
- **Price snapshots** - Captured at order time, immune to future changes
- **Immutable records** - Timestamped, never modifiable directly
- **Role segregation** - Strict permission boundaries
- **Audit trail** - Complete history for compliance

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Real-time** | Socket.io |
| **Auth** | JWT + bcryptjs |
| **Validation** | Joi |

---

## 📦 Installation

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm/yarn

### Clone Repo
\`\`\`bash
git clone https://github.com/Vivekkumarprince1/mess-bill.git
cd mess-froud
\`\`\`

### Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`

Create `/server/.env`:
\`\`\`
MONGO_URI=mongodb://localhost:27017/mess-fraud-db
JWT_SECRET=your_secret_key_here
PORT=5000
\`\`\`

### Frontend Setup
\`\`\`bash
cd ../client
npm install
\`\`\`

Create `/client/.env`:
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

---

## 🚀 Quick Start

### Terminal 1: Backend
\`\`\`bash
cd server
node server.js
# Output: Connected to Database, Server running on port 5000
\`\`\`

### Terminal 2: Frontend
\`\`\`bash
cd client
npm run dev
# Output: Local: http://localhost:5173/
\`\`\`

### Access Application
👉 **http://localhost:5173**

---

## 📁 Project Structure

\`\`\`
mess-froud/
├── client/
│   ├── src/
│   │   ├── components/Layout.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── VendorDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/api.js
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Order.js
│   │   ├── MonthlyBill.js
│   │   ├── PriceRequest.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   ├── orders.js
│   │   └── priceRequests.js
│   ├── middleware/auth.js
│   ├── server.js
│   └── package.json
│
└── README.md
\`\`\`

---

## 🔌 API Endpoints

All endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | All | Sign up |
| POST | `/api/auth/login` | All | Sign in |
| GET | `/api/items/approved` | Student/Vendor | Menu items |
| POST | `/api/items` | Vendor | Propose item |
| GET | `/api/orders` | All | List orders |
| POST | `/api/orders` | Student | Create order |
| PUT | `/api/orders/:id` | Vendor/Student | Dispense/Dispute |
| GET | `/api/price-requests` | Vendor/Admin | View requests |
| POST | `/api/price-requests` | Vendor | Submit request |
| PUT | `/api/price-requests/:id` | Admin | Approve/Reject |

---

## 👥 Test Workflows

### Flow 1: Complete Order
1. **Student**: Login → Browse menu → Click "Request" on item
2. **Vendor**: See live queue → Find request → Click "Confirm & Dispense"
3. **Student**: See order status change to Completed (via Socket.io)

### Flow 2: Dispute a Charge
1. **Student**: View completed order → Click "Dispute this charge" → Add reason
2. **Admin**: See disputed order in dashboard → Review → Investigate

### Flow 3: Price Change
1. **Vendor**: Submit price change request with reason
2. **Admin**: Review → Approve (price updates for future orders)

---

## 📊 Database Models

**User**: name, email, password (hashed), role, walletBalance
**Item**: name, price, approved flag, createdBy vendor
**Order**: studentId, vendorId, items[], total, status, timestamp
**MonthlyBill**: studentId, month, year, items[], totalAmount, status
**PriceRequest**: itemId, oldPrice, newPrice, reason, status, approvedBy
**AuditLog**: userId, action, metadata, timestamp

---

## 🌐 Deployment

### Heroku (Backend)
\`\`\`bash
cd server
heroku create your-app
heroku config:set MONGO_URI=<atlas_uri>
git push heroku main
\`\`\`

### Vercel (Frontend)
\`\`\`bash
cd client
vercel
# Set VITE_API_URL=<heroku_backend_url>/api
\`\`\`

---

## 📞 Support

- Issues: GitHub Issues
- Email: vivek@example.com
- Docs: See API Documentation above

---

**Version**: 1.0.0 | **Status**: ✅ Production Ready
