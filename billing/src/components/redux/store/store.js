import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/user.slice.js";
import itemSlice from "../slice/item.slice.js";
import additemSlice from "../slice/additem.slice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    category: itemSlice,
    item: additemSlice,
  },
});

export default store;
