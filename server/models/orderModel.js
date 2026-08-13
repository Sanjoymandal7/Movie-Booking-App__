const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "movie name is required"] },
    seat: { type: String, required: [true, "seat information is required"] },
    total: { type: Number, required: [true, "total is required"], min: [1, "total must be greater than zero"] },
    img: { type: String, required: [true, "movie image is required"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "user id is required"] },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
