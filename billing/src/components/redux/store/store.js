import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/user.slice.js";
import itemSlice from "../slice/item.slice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    item: itemSlice
  },
});

export default store;
