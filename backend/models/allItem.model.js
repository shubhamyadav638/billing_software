import mongoose from "mongoose";

const allItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
      required: true,
      enum: ["0", "5", "12", "18", "28"],
    },
  },
  { timestamps: true }
);

export const AllItem = mongoose.model("AllItem", allItemSchema);
