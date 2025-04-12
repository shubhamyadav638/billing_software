import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
});

export const Category = mongoose.model("Category", categorySchema);
