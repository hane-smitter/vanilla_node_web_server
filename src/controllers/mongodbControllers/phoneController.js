const { ObjectId } = require("mongodb");
const Phone = require("../../models/mongodbModels/Phone.js");

// create phone entry
const insertPhone = async (req, res) => {
  const phone = req.body;
  try {
    if (!Object.keys(phone).length) throw new Error("Provide field(s) to add");
    Object.keys(phone).forEach((key) => {
      if (typeof phone[key] === "string") {
        phone[key] = phone[key].toLowerCase();
      }
    });
    await Phone.insertOne(phone);
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
      let phones = await Phone.find().toArray();
      let randomPhoneId = Math.trunc(Math.random() * phones.length);
      id = phones[randomPhoneId]?._id;
    }
    let existingPhone = await Phone.findOne({ _id: ObjectId(id) });
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
      let phones = await Phone.find().toArray();
      let randomPhoneId = Math.trunc(Math.random() * phones.length);
      id = phones[randomPhoneId]._id;
    }
    if (!Object.keys(payload).length)
      throw new Error("provide field(s) to update Phone");
    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] === "string") {
        payload[key] = payload[key].toLowerCase();
      }
    });
    const existingUpdatedPhone = await Phone.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: payload },
      {
        returnDocument: "after",
      }
    );

    const { value } = existingUpdatedPhone;
    if (!value) throw new Error("Phone not found");

    res.json({
      op: "success",
      msg: "Phone updated!",
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

// Delete Phone
const deletePhone = async (req, res) => {
  const id = req.query.phoneId;
  const desc = req.body;

  try {
    // if (!id) throw new Error("Provide Phone ID");
    if (!Object.keys(desc).length)
      throw new Error("Provide field(s) to delete");
    Object.keys(desc).forEach((key) => {
      if (typeof desc[key] === "string") {
        desc[key] = desc[key].toLowerCase();
      }
    });
    const phones = await Phone.find(desc).toArray();
    if (!phones.length) throw new Error("No phones Found");
    for (i = 0; i < phones.length; i++) {
      await Phone.findOneAndDelete({
        _id: ObjectId(phones[i]._id),
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
