require('dotenv').config(); // This should be at the top of your file

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const app = express();
const category = require('./routes/categoryRoutes');
const dish = require('./routes/dishRoutes');
const authRoutes = require('./routes/authRoutes');
const proxyRoutes = require('./routes/proxyRoutes');


connectDB();
  
app.use(cors());
app.use(express.json());
app.use('/api/food', category);
app.use('/api/food', dish);
app.use('/login', authRoutes);
app.use(proxyRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
