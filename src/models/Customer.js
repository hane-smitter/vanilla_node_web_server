const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  address1: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  address2: {
    type: String,
    trim: true,
    lowercase: true,
  },
  town: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  eircode: {
    type: String,
    trim: true,
    lowercase: true,
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;