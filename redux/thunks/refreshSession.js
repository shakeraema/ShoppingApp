import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAuthSession } from "../../services/authApi";

export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { getState, rejectWithValue }) => {
    try {
      const stateRefreshToken = getState().auth.refreshToken;
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      const refreshToken = stateRefreshToken || storedRefreshToken;

      if (!refreshToken) {
        return rejectWithValue("No refresh token found");
      }

      const refreshed = await refreshAuthSession({
        refreshToken,
        expiresInMins: 30,
      });

      await AsyncStorage.multiSet([
        ["userToken", refreshed.accessToken],
        ["refreshToken", refreshed.refreshToken || refreshToken],
      ]);

      return {
        token: refreshed.accessToken,
        refreshToken: refreshed.refreshToken || refreshToken,
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to refresh session");
    }
  }
);
