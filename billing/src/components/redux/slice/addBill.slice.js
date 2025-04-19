import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addBillAPI, getBillsAPI } from "../../apis/callApi";

//! ========== Submit bill Thunk =========
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

//! ========== Get bill and bill item Thunk =========

// Async thunk
export const getBills = createAsyncThunk(
  "getBills",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getBillsAPI();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const billSlice = createSlice({
  name: "bills",
  initialState: {
    bills: [],
    loading: false,
    success: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder

      //! ========== Submit bill =========
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
      })

      //! ========== get bill and billitem  =========

      .addCase(getBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(getBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default billSlice.reducer;
