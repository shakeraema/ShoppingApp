import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentAuthUser, refreshAuthSession } from "../../services/authApi";

export const restoreToken = createAsyncThunk( // Action type
  "auth/restoreToken", // Action creator
  async (_, { rejectWithValue }) => {  
    try {
      const token = await AsyncStorage.getItem("userToken");
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");

      if (!token) {
        return rejectWithValue("No token found");
      }

      try {
        const user = await getCurrentAuthUser(token);
        return {
          token,
          refreshToken: storedRefreshToken,
          user,
        };
      } catch (error) {
        if (!storedRefreshToken) {
          await AsyncStorage.multiRemove(["userToken", "refreshToken"]);
          return rejectWithValue("Session expired");
        }

        const refreshed = await refreshAuthSession({
          refreshToken: storedRefreshToken,
          expiresInMins: 30,
        });

        const nextAccessToken = refreshed?.accessToken;
        const nextRefreshToken = refreshed?.refreshToken || storedRefreshToken;

        await AsyncStorage.multiSet([
          ["userToken", nextAccessToken],
          ["refreshToken", nextRefreshToken],
        ]);

        const user = await getCurrentAuthUser(nextAccessToken);

        return {
          token: nextAccessToken,
          refreshToken: nextRefreshToken,
          user,
        };
      }
    } catch (error) {
      await AsyncStorage.multiRemove(["userToken", "refreshToken"]);
      return rejectWithValue(error?.message || "Failed to restore token");
    }
  }
);
