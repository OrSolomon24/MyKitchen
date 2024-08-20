require('dotenv').config(); // This should be at the top of your file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const category = require('./routes/categoryRoutes');
const dish = require('./routes/dishRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
  
app.use(cors());
app.use(express.json());
app.use('/api/food', category);
app.use('/api/food', dish);
app.use('/login', authRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

