const mongoose = require("mongoose");
const Customer = require("../models/Customer.js");

const Order = require("../models/Order.js");
const Phone = require("../models/Phone.js");

// create order entry
const insertOrder = async (req, res) => {
  const order = req.body;
  try {
    if (!Object.keys(order).length) throw new Error("Provide field(s) to add");
    // constraints
    // If phone exists
    const phoneId = order.phone;
    const phoneExists = await Phone.findById(phoneId);
    if (!phoneExists) throw new Error("Phone with the provided ID not found");
    // If customer exists
    const customerId = order.customer;
    const customerExists = await Customer.findById(customerId);
    if (!customerExists)
      throw new Error("Customer with the provided ID not found");

    // Add new Order
    const newOrder = new Order(order);
    await newOrder.save();
    res.json({
      op: "success",
      msg: "order added successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ op: "error", msg: error.message });
  }
};

// Find/retrieve order
const findOrder = async (req, res) => {
  let id = req.query.orderId;

  try {
    if (!id) {
      const orders = await Order.find();
      let randomOrderId = Math.trunc(Math.random() * orders.length);
      id = orders[randomOrderId]._id;
    }
    let existingOrder = await Order.findById(id);
    if (!existingOrder) throw new Error("Order not found");

    res.json({
      op: "success",
      msg: "",
      body: existingOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  let id = req.query.orderId;
  const payload = req.body;

  try {
    // Get random orders if ID is not provided
    if (!id) {
      let orders = await Order.find();
      let randomOrderId = Math.trunc(Math.random() * orders.length);
      id = orders[randomOrderId]._id;
    }
    if (!Object.keys(payload).length)
      throw new Error("provide field(s) to update Order");

    // constraints
    // If phone exists
    if (payload.phone) {
      const phoneId = payload.phone;
      const phoneExists = await Phone.findById(phoneId);
      if (!phoneExists)
        throw new Error("Phone with the provided ID does not exist");
    }
    // If customer exists
    if (payload.customer) {
      const customerId = payload.customer;
      const customerExists = await Customer.findById(customerId);
      if (!customerExists)
        throw new Error("Customer with the provided ID does not exist");
    }

    const existingUpdatedOrder = await Order.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!existingUpdatedOrder) throw new Error("Order not found");

    res.json({
      op: "success",
      msg: "Order updated!",
      body: existingUpdatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  const id = req.query.orderId;
  const desc = req.body;

  try {
    const mapDesc = {
      ...(desc.phone && { phone: mongoose.Types.ObjectId(desc.phone) }),
      ...(desc.customer && {
        customer: mongoose.Types.ObjectId(desc.customer),
      }),
    };
    if (!Object.keys(mapDesc).length)
      throw new Error("Provide field(s) to delete Order");
    const orders = await Order.find(mapDesc);
    if (!orders.length) throw new Error("No orders Found");
    for (i = 0; i < orders.length; i++) {
      await Order.findOneAndDelete({
        _id: mongoose.Types.ObjectId(orders[i]._id),
      });
    }

    res.json({
      op: "success",
      msg: "Order entries Deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

module.exports = { insertOrder, findOrder, updateOrder, deleteOrder };
