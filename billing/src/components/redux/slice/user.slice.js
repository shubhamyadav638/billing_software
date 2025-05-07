import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  changePassAPI,
  login,
  removeUserImgAPI,
  updateUserProfileAPI,
} from "../../apis/callApi";

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
  "updateProfile",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateUserProfileAPI(id, formData);
    } catch (error) {
      return rejectWithValue(error.message || "Profile update failed");
    }
  }
);

//!------------- change User pass  thunk ---------------
export const changePassword = createAsyncThunk(
  "changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      return await changePassAPI(passwordData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

//!------------- remove user image thunk ---------------
export const removeUserImg = createAsyncThunk(
  "removeUserImg",
  async (id, { rejectWithValue }) => {
    try {
      return await removeUserImgAPI(id);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove image");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || {},
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
      // .addCase(userLogin.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload;
      //   const token = action.payload?.token;
      //   const userData = action.payload?.user;
      //   if (token) {
      //     localStorage.setItem("token", token);
      //     localStorage.setItem("user", JSON.stringify(userData));
      //   }
      // })

      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        const token = action.payload?.token;
        const userData = action.payload?.user;

        if (userData) {
          state.user = userData;
          localStorage.setItem("user", JSON.stringify(userData));
        }

        if (token) {
          localStorage.setItem("token", token);
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

        const updatedUser = action.payload.user;

        if (updatedUser) {
          state.user = {
            ...state.user,
            ...updatedUser,
          };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //!========== change pass =======
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.user = action.payload.user;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //!========== remove user image =======
      .addCase(removeUserImg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserImg.fulfilled, (state) => {
        state.loading = false;
        const updatedUser = {
          ...state.user,
          imgUrl: null,
        };
        state.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .addCase(removeUserImg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearToken } = userSlice.actions;
export default userSlice.reducer;
