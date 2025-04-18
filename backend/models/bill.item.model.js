import mongoose from "mongoose";

const BillItemSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bills",
    required: true,
  },
  itemId: mongoose.Schema.Types.ObjectId,
  itemName: String,
  price: mongoose.Schema.Types.Decimal128,
  quantity: Number,
  total: mongoose.Schema.Types.Decimal128,
  unit: String,
  img: String,
  category: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
});

export const BillItem = mongoose.model("BillItem", BillItemSchema);
