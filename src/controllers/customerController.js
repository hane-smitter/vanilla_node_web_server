const { default: mongoose } = require("mongoose");
const Customer = require("../models/Customer");

// create customer entry
const insertCustomer = async (req, res) => {
  const customer = req.body;
  console.log("req body from controller", customer);
  try {
    if (!Object.keys(customer).length)
      throw new Error("Provide field(s) to add");

    const newCustomer = new Customer(customer);
    await newCustomer.save();
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
      let customers = await Customer.find();
      let randomCustomerId = Math.trunc(Math.random() * customers.length);
      id = customers[randomCustomerId]._id;
    }
    let existingCustomer = await Customer.findById(id);
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
    let existingCustomer = await Customer.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!existingCustomer) throw new Error("Customer not found");

    res.json({
      op: "success",
      msg: "Customer updated!",
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

// Delete customer
const deleteCustomer = async (req, res) => {
  const id = req.query.customerId;
  const desc = req.body;

  try {
    // if (!id) throw new Error("Provide customer ID");
    const customer = await Customer.find(desc);
    if (!Object.keys(desc).length)
      throw new Error("Provide field(s) to delete");
    for (i = 0; i < customer.length; i++) {
      await Customer.findOneAndDelete({
        _id: mongoose.Types.ObjectId(customer[i]._id),
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
