require('dotenv').config();
const express = require('express');
const cors = require('cors');
const category = require('./routes/categoryRoutes');
const dish = require('./routes/dishRoutes');
const proxyRoutes = require('./routes/proxyRoutes');
const recipeAiRoutes = require('./routes/recipeAiRoutes');

const app = express();

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
app.use('/api/recipes', recipeAiRoutes);
app.use(proxyRoutes);

module.exports = app;

// comment out when developing locally to run the backend on port 5000
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });
