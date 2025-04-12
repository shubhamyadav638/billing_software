import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCategoryAPI,
  deleteCategoryAPI,
  getCategoriesAPI,
  editCategoryAPI,
} from "../../apis/callApi";

//!============ Add category  ==============
export const addCategory = createAsyncThunk(
  "addCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addCategoryAPI(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//!============ Get category  ==============
export const getCategories = createAsyncThunk(
  "getCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await getCategoriesAPI();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load categories"
      );
    }
  }
);

//!============ Edit category  ==============
export const editCategory = createAsyncThunk(
  "Edit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await editCategoryAPI(id, formData);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Edit failed" });
    }
  }
);

//!============ Delete category ==============
export const deleteCategory = createAsyncThunk(
  "delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteCategoryAPI(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Delete failed" }
      );
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //!------------- add category -------------
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      //!================ get category =========
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //!============= Edit User =========

      .addCase(editCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      //!========== Delete user ========
      .addCase(deleteCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = itemSlice.actions;
export default itemSlice.reducer;
