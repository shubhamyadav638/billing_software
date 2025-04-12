import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, } from "../../apis/callApi";



//!------------- user login thunk ---------------

export const userLogin = createAsyncThunk(
  "login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await login(credentials);
    } catch (error) {
      return rejectWithValue(error.message || "Login failed ");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    clearToken: (state) => {
      state.token = null;
      state.user = [];
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
     
    //!------------- user login ----------------
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        const token = action.payload?.token;
        if (token) {
          localStorage.setItem("token", token);
        }
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearToken } = userSlice.actions;
export default userSlice.reducer;
