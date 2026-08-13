const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const orderModel = require("../models/orderModel");

exports.createOrderController = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { name, seat, total, img, user } = req.body;
    const numericTotal = Number(total);

    if (!name || !seat || !img || !user || !Number.isFinite(numericTotal) || numericTotal <= 0) {
      return res.status(400).send({ success: false, message: "Please provide valid booking details." });
    }

    const existingUser = await userModel.findById(user).session(session);
    if (!existingUser) {
      return res.status(404).send({ success: false, message: "Unable to find user." });
    }

    session.startTransaction();
    const newOrder = new orderModel({ name, seat, total: numericTotal, img, user });
    await newOrder.save({ session });
    existingUser.order.push(newOrder._id);
    await existingUser.save({ session });
    await session.commitTransaction();

    return res.status(201).send({ success: true, message: "Order created!", newOrder });
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("Create order error:", error);
    return res.status(500).send({ success: false, message: "Error while creating order.", error: error.message });
  } finally {
    await session.endSession();
  }
};

exports.userOrderControlller = async (req, res) => {
  try {
    const userOrder = await userModel.findById(req.params.id).populate("order");
    if (!userOrder) return res.status(404).send({ success: false, message: "Orders not found with this id." });
    return res.status(200).send({ success: true, message: "User orders", userOrder });
  } catch (error) {
    console.error("User order error:", error);
    return res.status(500).send({ success: false, message: "Error in user orders.", error: error.message });
  }
};
