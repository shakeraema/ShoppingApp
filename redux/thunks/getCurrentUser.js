import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentAuthUser } from "../../services/authApi";

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (accessToken, { getState, rejectWithValue }) => {
    try {
      const token = accessToken || getState().auth.userToken;
      if (!token) {
        return rejectWithValue("No access token found");
      }

      const user = await getCurrentAuthUser(token);
      return { user };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch current user");
    }
  }
);
