const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
