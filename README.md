# Canteen Management & Anti-Fraud System

This is a full-stack web application built to prevent overbilling in a college/hostel canteen with a transparent digital system.

## 🛠️ Stack
- **Frontend:** React (Vite) + Tailwind CSS + Lucide React + React Router v6
- **Backend:** Node.js + Express + Socket.io + JWT + Mongoose 
- **Database:** MongoDB
- **Real-time Engine:** Socket.io

## 📁 Project Structure
- `/client` - Contains the React Vite project.
- `/server` - Contains the robust Node.js + Express API.
- `/shared` - For shared types/constants (optional).

## 🚀 Getting Started

### 1. Database Setup
Make sure MongoDB is running locally or specify a connection string in `/server/.env` as `MONGO_URI`.

### 2. Run Backend
```bash
cd server
npm install
npm run start # You might want to map this to "node server.js" in package.json
# or simply:
node server.js
```

### 3. Run Frontend
```bash
cd client
npm install
npm run dev
```

## 🔐 Implemented Base Models
- **UserModel:** Roles (`Student`, `Vendor`, `Admin`, `Super Admin`), standard credentials, encrypted passwords.
- **ItemModel:** Track prices and Admin approval flag.
- **OrderModel:** Capture order records, calculated totals, status (`Pending`, `Completed`), stores QR context.
- **MonthlyBillModel:** Aggregates order prices historically for individual lock-ins so changes to items don't impact historical bills.
- **AuditLogModel:** Track who performed sensitive actions to meet the Anti-Fraud constraint.

You can spin up the MongoDB URI, use the auth endpoint (`POST /api/auth/register`, `POST /api/auth/login`), then expand the controllers using the schemas in the `server/models` directory!
