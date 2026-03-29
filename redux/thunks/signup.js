import { createAsyncThunk } from "@reduxjs/toolkit";

export const signup = createAsyncThunk(
  "auth/signup",
  async (_, { rejectWithValue }) => {
    return rejectWithValue(
      "Signup is disabled in strict DummyJSON auth mode. Use existing DummyJSON users to login."
    );
  }
);