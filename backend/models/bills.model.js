import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    tableNumber: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);
