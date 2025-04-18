import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addBillAPI } from "../../apis/callApi";

//! ========== Add bill Thunk =========
export const submitBill = createAsyncThunk(
  "submitBill",
  async (billData, { rejectWithValue }) => {
    try {
      const data = await addBillAPI(billData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const billSlice = createSlice({
  name: "bills",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBill.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitBill.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default billSlice.reducer;
