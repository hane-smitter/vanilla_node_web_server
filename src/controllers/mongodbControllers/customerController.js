const { ObjectId } = require("mongodb");
const Customer = require("../../models/mongodbModels/Customer.js");

// create customer entry
const insertCustomer = async (req, res) => {
  const customer = req.body;
  try {
    if (!Object.keys(customer).length)
      throw new Error("Provide field(s) to add");
    Object.keys(customer).forEach((key) => {
      if (typeof customer[key] === "string") {
        customer[key] = customer[key].toLowerCase();
      }
    });

    await Customer.insertOne(customer);
    // const newCustomer = new Customer(customer);
    // await newCustomer.save();
    res.json({
      op: "success",
      msg: "customer added successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ op: "error", msg: error.message });
  }
};

// Find/retrieve customer
const findCustomer = async (req, res) => {
  let id = req.query.customerId;
  console.log(id);

  try {
    // Get random customer if ID is not provided
    if (!id) {
      let customers = await Customer.find().toArray();
      // console.log("customer mongodbdriver", customers);
      let randomCustomerId = Math.trunc(Math.random() * customers.length);
      id = customers[randomCustomerId]?._id;
    }
    const existingCustomer = await Customer.findOne({ _id: ObjectId(id) });
    if (!existingCustomer) throw new Error("Customer not found");

    console.log(
      `The following customer has been retrieved:\nName: ${existingCustomer.firstname} ${existingCustomer.surname}\nPhone: ${existingCustomer.mobile}`
    );
    console.log(
      `Email: ${existingCustomer.email}\nTown: ${existingCustomer.town}\nCity: ${existingCustomer.city}`
    );
    console.log(
      `Address 1: ${existingCustomer.address1}\nAddress 2 ${existingCustomer.address2}\nEIRCODE: ${existingCustomer.eircode}`
    );

    res.json({
      op: "success",
      msg: "",
      body: existingCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

// Update Customer
const updateCustomer = async (req, res) => {
  const allowedUpdates = ["mobile", "title", "email", "address1", "address2"];
  const id = req.query.customerId;
  const payload = req.body;

  try {
    const allowed = Object.keys(payload).every((key) =>
      allowedUpdates.includes(key)
    );
    if (!allowed) throw new Error("Trying to update disallowed field");
    if (!id) throw new Error("Provide customer ID");
    if (!Object.keys(payload).length)
      throw new Error("provide field(s) to update customer");
    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] === "string") {
        payload[key] = payload[key].toLowerCase();
      }
    });
    let existingCustomer = await Customer.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: payload },
      {
        returnDocument: "after",
      }
    );
    const { value } = existingCustomer;
    console.log(value);
    if (!value) throw new Error("Customer not found");

    res.json({
      op: "success",
      msg: "Customer updated!",
      body: value,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  const id = req.query.customerId;
  const desc = req.body;

  try {
    // if (!id) throw new Error("Provide customer ID");
    const customers = await Customer.find(desc).toArray();
    if (!Object.keys(desc).length)
      throw new Error("Provide field(s) to delete");
    Object.keys(desc).forEach((key) => {
      if (typeof desc[key] === "string") {
        desc[key] = desc[key].toLowerCase();
      }
    });
    for (i = 0; i < customers.length; i++) {
      await Customer.findOneAndDelete({
        _id: ObjectId(customers[i]._id),
      });
    }

    res.json({
      op: "success",
      msg: "Customer entries Deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};
module.exports = {
  insertCustomer,
  findCustomer,
  updateCustomer,
  deleteCustomer,
};
