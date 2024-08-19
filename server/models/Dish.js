const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  ingredients: [String],
  instruction: String,
  url: String,
  categoryid: { type: Number },
  dishid: { type: Number }
});

module.exports = mongoose.model('Dish', dishSchema);
