#!/bin/bash

# Canteen Management System - Setup Script

echo "🍽️  Canteen Management & Anti-Fraud System"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check MongoDB
if ! command -v mongod &> /dev/null && ! command -v mongosh &> /dev/null; then
    echo "⚠️  MongoDB not found. Please ensure MongoDB is running."
    echo "   Start with: brew services start mongodb-community (macOS)"
    echo "   Or: docker run -d -p 27017:27017 --name mongodb mongo:latest"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd server
npm install
if [ ! -f .env ]; then
    echo "Creating .env file in server..."
    cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/mess-fraud-db
JWT_SECRET=dev_secret_key_change_in_production
PORT=5000
NODE_ENV=development
EOF
    echo "✅ Created server/.env"
fi
cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd client
npm install
if [ ! -f .env ]; then
    echo "Creating .env file in client..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created client/.env"
fi
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd server && npm run start"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd client && npm run dev"
echo ""
echo "   Then open: http://localhost:5173"
echo ""
