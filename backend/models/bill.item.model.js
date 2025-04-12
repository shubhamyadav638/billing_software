import mongoose from "mongoose";

const billitemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    itemQuantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const billItem = mongoose.model("billItem", billitemSchema);
