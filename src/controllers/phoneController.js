const mongoose = require("mongoose");

const Phone = require("../models/Phone.js");

// create phone entry
const insertPhone = async (req, res) => {
  const phone = req.body;
  try {
    if (!Object.keys(phone).length) throw new Error("Provide field(s) to add");
    const newPhone = new Phone(phone);
    await newPhone.save();
    res.json({
      op: "success",
      msg: "phone added successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ op: "error", msg: error.message });
  }
};

// Find/retrieve phone
const findPhone = async (req, res) => {
  let id = req.query.phoneId;

  try {
    if (!id) {
      let phones = await Phone.find();
      let randomPhoneId = Math.trunc(Math.random() * phones.length);
      id = phones[randomPhoneId]._id;
    }
    let existingPhone = await Phone.findById(id);
    if (!existingPhone) throw new Error("Phone not found");

    res.json({
      op: "success",
      msg: "",
      body: existingPhone,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

// Update Phone
const updatePhone = async (req, res) => {
  let id = req.query.phoneId;
  const payload = req.body;

  try {
    // Get random phones if ID is not provided
    if (!id) {
      let phones = await Phone.find();
      let randomPhoneId = Math.trunc(Math.random() * phones.length);
      id = phones[randomPhoneId]._id;
    }
    if (!Object.keys(payload).length)
      throw new Error("provide field(s) to update Phone");
    const existingUpdatedPhone = await Phone.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!existingUpdatedPhone) throw new Error("Phone not found");

    res.json({
      op: "success",
      msg: "Phone updated!",
      body: existingUpdatedPhone,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

// Delete Phone
const deletePhone = async (req, res) => {
  const id = req.query.phoneId;
  const desc = req.body;

  try {
    // if (!id) throw new Error("Provide Phone ID");
    if (!Object.keys(desc).length)
      throw new Error("Provide field(s) to delete");
    const phone = await Phone.find(desc);
    if (!phone.length) throw new Error("No phones Found");
    for (i = 0; i < phone.length; i++) {
      await Phone.findOneAndDelete({
        _id: mongoose.Types.ObjectId(phone[i]._id),
      });
    }

    res.json({
      op: "success",
      msg: "Phone entries Deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      op: "error",
      msg: error.message,
    });
  }
};

module.exports = { insertPhone, findPhone, updatePhone, deletePhone };
