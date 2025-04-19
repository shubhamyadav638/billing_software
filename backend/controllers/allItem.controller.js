import { AllItem } from "../models/allItem.model.js";
import fs from "fs";
import path from "path";

const getUploadsPath = (filename) => {
  return path.join(path.resolve(), "uploads", filename);
};

//!========================== ADD ITEMS =====

export const addItem = async (req, res) => {
  try {
    const { itemName, price, unit, category, gst } = req.body;
    const imgFile = req.file;

    if (!itemName || !price || !unit || !category || !gst || !imgFile) {
      if (imgFile) {
        const filePath = getUploadsPath(imgFile.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({ error: "All fields are required" });
    }

    const newItem = new AllItem({
      itemName,
      price,
      unit,
      img: `${req.protocol}://${req.get("host")}/itemimg/${imgFile.filename}`,
      category,
      gst,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add item",
      details: err.message,
    });
  }
};

//!================ Edit ITEM ================

export const editItem = async (req, res) => {
  try {
    const { itemName, price, unit, category, gst } = req.body || {};
    const imgFile = req.file;
    const itemId = req.params.id;

    if (!itemId) return res.status(400).json({ error: "Missing item ID" });

    const item = await AllItem.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (imgFile && item.img) {
      const oldImagePath = getUploadsPath(path.basename(item.img));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedItem = await AllItem.findByIdAndUpdate(
      itemId,
      {
        itemName: itemName ?? item.itemName,
        price: price ?? item.price,
        unit: unit ?? item.unit,
        category: category ?? item.category,
        gst: gst ?? item.gst,
        img: imgFile
          ? `${req.protocol}://${req.get("host")}/itemimg/${imgFile.filename}`
          : item.img,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Item edit successfully",
      updatedItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to edit item",
      details: err.message,
    });
  }
};

//!========== Get all items ==========

export const getAllItems = async (req, res) => {
  try {
    const items = await AllItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get items", details: err.message });
  }
};

//!========================== DELETE ITEMS =====

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await AllItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });

    const imagePath = getUploadsPath(path.basename(deletedItem.img));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete item", details: err.message });
  }
};

// //!============= Get single item =========

// export const getItemById = async (req, res) => {
//   try {
//     const item = await AllItem.findById(req.params.id);
//     if (!item) return res.status(404).json({ error: "Item not found" });
//     res.status(200).json(item);
//   } catch (err) {
//     res.status(500).json({ error: "Error Get item", details: err.message });
//   }
// };
