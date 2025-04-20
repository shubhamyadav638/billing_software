import { BillItem } from "../models/bill.item.model.js";
import { Bills } from "../models/bills.model.js";

//! ==========  Add Bill Data =============
export const addBill = async (req, res) => {
  try {
    const {
      items,
      subTotal,
      discount,
      grandTotal,
      createdAt,
      totalTax,
      customerPhone,
      paymentMethod,
    } = req.body;

    const newBill = await Bills.create({
      subTotal,
      discount,
      grandTotal,
      createdAt,
      totalTax,
      customerPhone,
      paymentMethod,
    });

    // console.log(items);

    //! ============ Add Bill item ==========
    const loopItems = await Promise.all(
      items.map(async (item) => {
        return await BillItem.create({
          billId: newBill._id,
          itemId: item._id,
          itemName: item.itemName.trim(),
          price: item.price["$numberDecimal"] || item.price,
          quantity: item.quantity,
          total: item.price["$numberDecimal"] * item.quantity,
          unit: item.unit,
          img: item.img,
          category: item.category,
          createdAt: createdAt,
        });
      })
    );

    res.status(201).json({
      message: "Bill items save",
      bill: newBill,
      billItems: loopItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add bill",
      details: err.message,
    });
  }
};

//! ========== Cancel Bill =============
export const cancelBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const updatedBill = await Bills.findByIdAndUpdate(
      billId,
      { billStatus: "Cancelled" },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.status(200).json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//! ============ Get Bill and billitem ==========
export const getBills = async (req, res) => {
  try {
    const bills = await Bills.find().sort({ createdAt: -1 });
    const billsWithItems = await Promise.all(
      bills.map(async (bill) => {
        const billItems = await BillItem.find({ billId: bill._id });
        return { ...bill.toObject(), billItems };
      })
    );
    res.json(billsWithItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
