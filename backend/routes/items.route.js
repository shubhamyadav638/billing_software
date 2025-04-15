import express from "express";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
} from "../controllers/item.controller.js";
import {
  addItem,
  deleteItem,
  editItem,
  getAllItems,
} from "../controllers/allItem.controller.js";
import { uploadImage } from "../middlewares/categoryImageUpload.js";
import { upload } from "../middlewares/itemImageupload.js";

const router = express.Router();

//!================ category route ===========
router.post("/addcategory", uploadImage.single("img"), addCategory);
router.get("/getcategories", getAllCategories);
router.put("/category/:id", uploadImage.single("img"), editCategory);
router.delete("/category/:id", deleteCategory);

//!================ Item route ===========
router.get("/allitem", getAllItems);
router.post("/additem", upload.single("img"), addItem);
router.put("/editItem/:id", upload.single("img"), editItem);
router.delete("/deleteitem/:id", deleteItem);
export default router;
