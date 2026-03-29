import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login,
  signup,
  updateUserProfile,
  logout,
  restoreToken,
  getCurrentUser,
  refreshSession,
} from "../thunks";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    users: [],
    userToken: null,
    refreshToken: null,
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userToken = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.userData = action.payload.user;
        state.loading = false;
        AsyncStorage.multiSet([
          ["userToken", action.payload.token],
          ["refreshToken", action.payload.refreshToken || ""],
        ]);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(restoreToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        state.userToken = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.userData = action.payload.user;
        state.loading = false;
      })
      .addCase(restoreToken.rejected, (state) => {
        state.loading = false;
        state.userToken = null;
        state.refreshToken = null;
        state.userData = null;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get current user";
      })
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.userToken = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to refresh session";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        if (action.payload.rawUser) {
          state.users.push(action.payload.rawUser); 
        }
        state.userToken = action.payload.token;
        state.userData = action.payload.user;
        state.refreshToken = action.payload.refreshToken || null;
        state.loading = false;
        AsyncStorage.multiSet([
          ["userToken", action.payload.token],
          ["refreshToken", action.payload.refreshToken || ""],
        ]);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
  state.users = action.payload.users;
  state.userData = action.payload.userData;
})
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true; // Set loading to true when logout is initiated, this indicates that the logout process is in progress, and can be used to show a loading indicator in the UI if needed.
        state.error = null; // Clear any existing errors when logout is initiated, this ensures that any previous error messages do not persist during the logout process, providing a clean state for the user.
      })
      .addCase(logout.fulfilled, (state) => {
        state.userToken = null;
        state.refreshToken = null;
        state.userData = null;
        state.loading = false;
        AsyncStorage.multiRemove(["userToken", "refreshToken"]);
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;