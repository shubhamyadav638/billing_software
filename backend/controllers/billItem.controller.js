import { BillItem } from "../models/bill.item.model.js";

//! ============ Get Bill item ==========
export const getAllBillItems = async (req, res) => {
  try {
    const bills = await BillItem.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bills", error });
  }
};
