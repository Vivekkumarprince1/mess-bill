import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import orderRoutes from './routes/orders.js';
import priceRequestRoutes from './routes/priceRequests.js';

dotenv.config();

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5000']; // Add more origins as needed
app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Attach socket.io to the app so routes can use it via req.app.get('io')
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/price-requests', priceRequestRoutes);

app.get('/health', (req, res) => res.send('API Functional'));

// Wait for socket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mess-fraud-db').then(() => {
  console.log('Connected to Database');
  server.listen(5002, () => console.log('Server running on port 5002'));
}).catch(err => console.log(err));
