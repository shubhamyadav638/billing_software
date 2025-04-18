import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/user.slice.js";
import itemSlice from "../slice/item.slice.js";
import additemSlice from "../slice/additem.slice.js";
import billSlice from "../slice/addBill.slice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    categories: itemSlice,
    items: additemSlice,
    bills: billSlice,
  },
});

export default store;
