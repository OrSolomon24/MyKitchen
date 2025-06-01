
// 📁 server/index.js (or wherever your Express app is defined)
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

app.use(cors());
app.use(express.json());

app.use('/api/food', category);
app.use('/api/food', dish);
app.use('/auth', authRoutes);
app.use(proxyRoutes);

module.exports = app;