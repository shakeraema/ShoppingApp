import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getUserId = (state) => state.auth.userData?.id || null;

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { getState, rejectWithValue }) => {
    const state = getState();
    const user = state.auth.userData;
    const userId = getUserId(state);

    if (!userId || !user) {
      return rejectWithValue("Please login to place an order");
    }

    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      userId,
      userEmail: user.email,
      userName: user.name,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      items: orderData.items,
      subtotal: Number(orderData.subtotal),
      shipping: Number(orderData.shipping),
      tax: Number(orderData.tax),
      total: Number(orderData.total),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return { userId, order };
  }
);

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
