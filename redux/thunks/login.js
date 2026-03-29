import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAuth } from "../../services/authApi";

export const login = createAsyncThunk(
  "auth/login", 
  async ({ email, username, identifier, password }, { rejectWithValue }) => { 
    try {
      const usernameOrEmail = identifier || username || email;
      const authResult = await loginAuth({
        username: usernameOrEmail,
        email: usernameOrEmail,
        password,
        expiresInMins: 30,
      });
      return {
        token: authResult.accessToken,
        refreshToken: authResult.refreshToken,
        user: authResult.user,
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Invalid username/email or password");
    }
  }
);