require('dotenv').config(); // This should be at the top of your file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const request = require('request'); // Import the request package
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

// Proxy route
app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL is required');

  request(
    {
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0' // You can customize the user-agent if needed
      }
    },
    (error, response, body) => {
      if (error) return res.status(500).send('Error fetching the URL');

      // Remove or modify the headers that prevent embedding
      res.set('Content-Type', response.headers['content-type']);
      res.send(body);
    }
  );
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
