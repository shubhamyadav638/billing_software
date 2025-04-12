import { Category } from "../models/addCategory.model.js";

//!========================== Add category =====
export const addCategory = async (req, res) => {
  try {
    const { itemName } = req.body;
    const file = req.file;

    if (!itemName || !file) {
      return res
        .status(400)
        .json({ message: "Item name and image are required" });
    }

    const imgUrl = `${req.protocol}://${req.get("host")}/Categoryimg/${
      file.filename
    }`;

    const newCategory = new Category({ itemName, imgUrl });
    await newCategory.save();

    res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Add Category Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//!====================== get category ============================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Fetch Categories Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//! ============== EDIT CATEGORY ============
export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName } = req.body;
    const file = req.file;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (itemName) {
      category.itemName = itemName;
    }
    if (file) {
      const imgUrl = `${req.protocol}://${req.get("host")}/Categoryimg/${
        file.filename
      }`;
      category.imgUrl = imgUrl;
    }
    const editedCategory = await category.save();

    res.status(200).json({
      message: "Category edited successfully",
      category: editedCategory,
    });
  } catch (error) {
    console.error("Edit Category Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//! ============== DELETE CATEGORY ============
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Delete Category Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
