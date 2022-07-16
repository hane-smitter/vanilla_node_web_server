const mongoose = require("mongoose");

const phoneSchema = mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Phone = mongoose.model("Phone", phoneSchema);

module.exports = Phone;