import express from "express";
import { addCategory, deleteCategory, editCategory, getAllCategories } from "../controllers/item.controller.js";
import { uploadImage } from "../middlewares/imageUpload.js";

const router = express.Router();

router.post("/addcategory", uploadImage.single("img"), addCategory);
router.get("/getcategories", getAllCategories);
router.put('/category/:id', uploadImage.single('img'), editCategory);
router.delete('/category/:id', deleteCategory);


export default router;
