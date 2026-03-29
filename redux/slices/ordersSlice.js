import { createSlice } from "@reduxjs/toolkit";
import { createOrder } from "../thunks";


const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    ordersByUser: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        const { userId, order } = action.payload;
        const existing = state.ordersByUser[userId] || [];
        state.ordersByUser[userId] = [order, ...existing];
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to place order";
      });
  },
});

export default ordersSlice.reducer;
