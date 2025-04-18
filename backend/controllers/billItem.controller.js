import { BillItem } from "../models/bill.item.model.js";

//! ============ Add Bill item ==========
export const addBillItem = async (req, res) => {
  try {
    const billData = req.body;
    console.log("Received bill:", billData);

    const newBill = await BillItem.create(billData);
    res.status(201).json(newBill);
  } catch (error) {
    console.error("Error saving bill:", error);
    res.status(500).json({ message: "Error adding bill", error });
  }
};

//! ============ Get Bill item ==========
export const getAllBillItems = async (req, res) => {
  try {
    const bills = await BillItem.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bills", error });
  }
};
