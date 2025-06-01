require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const category = require('./routes/categoryRoutes');
const dish = require('./routes/dishRoutes');
const authRoutes = require('./routes/authRoutes');
const proxyRoutes = require('./routes/proxyRoutes');

const app = express();
connectDB();

// ✅ הגדרת CORS עם דומיינים מותרים
const allowedOrigins = [
  'https://my-kitchen-two.vercel.app', // פרונט בפרודקשן
  'http://localhost:3000'              // פיתוח מקומי
];

app.use(cors({
  origin: function (origin, callback) {
    // תן גישה גם כש-origin ריק (למשל curl או Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/food', category);
app.use('/api/food', dish);
app.use('/auth', authRoutes);
app.use(proxyRoutes);

module.exports = app;
