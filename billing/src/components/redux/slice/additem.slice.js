// src/slices/itemSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addItemAPI,
  deleteItemAPI,
  editItemAPI,
  getAllItemsAPI,
} from "../../apis/callApi";

export const addItem = createAsyncThunk(
  "addItem",
  async ({ itemData, file }) => {
    try {
      const response = await addItemAPI(itemData, file);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add item");
    }
  }
);

export const editItem = createAsyncThunk(
  "editItem",
  async ({ id, itemData, file }) => {
    try {
      const response = await editItemAPI(id, itemData, file);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to edit item");
    }
  }
);

export const getAllItems = createAsyncThunk("getAllItems", async () => {
  try {
    const response = await getAllItemsAPI();
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get items");
  }
});

export const deleteItem = createAsyncThunk("deleteItem", async (id) => {
  try {
    await deleteItemAPI(id);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete item");
  }
});

const additemSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    loading: false,
    cart: [],
    // carts: savedCart,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const oldItem = state.cart.find((i) => i._id === item._id);
      if (oldItem) {
        oldItem.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }
    },
    removeCart: (state, action) => {
      const itemId = action.payload;
      state.cart = state.cart.filter((i) => i._id !== itemId);
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cart.find((i) => i._id === itemId);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cart.find((i) => i._id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cart = state.cart.filter((i) => i._id !== itemId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //! ================= For Add Item =============
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //! =============== For Edit Item ===============
      .addCase(editItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //! ============== For Get All Items ============
      .addCase(getAllItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //! ========== Delete Item ===========
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { addToCart, removeCart, incrementQuantity, decrementQuantity } =
  additemSlice.actions;
export default additemSlice.reducer;
