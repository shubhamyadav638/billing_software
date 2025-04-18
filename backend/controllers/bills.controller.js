import { BillItem } from "../models/bill.item.model.js";
import { Bills } from "../models/bills.model.js";

//! ==========  Add Bill Data =============
export const addBill = async (req, res) => {
  try {
    const { items, subTotal, discount, grandTotal, createdAt } = req.body;

    const newBill = await Bills.create({
      subTotal,
      discount,
      grandTotal,
      createdAt,
    });

    console.log(items);

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
