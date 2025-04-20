import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, updateUserProfileAPI } from "../../apis/callApi";

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

//!------------- update User Profile  thunk ---------------

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      return await updateUserProfileAPI(id, profileData);
    } catch (error) {
      return rejectWithValue(error.message || "Profile update failed");
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
      localStorage.removeItem("user");
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
        const userData = action.payload?.user;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //!------------- user update profile ----------------
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearToken } = userSlice.actions;
export default userSlice.reducer;
