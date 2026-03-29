import { createAsyncThunk } from "@reduxjs/toolkit";

export const logout = createAsyncThunk("auth/logout", async () => true);// Action type, Action creator, Async function to handle logout logic, in this case it simply returns true to indicate a successful logout, the actual clearing of user data and token will be handled in the reducer when this action is fulfilled.