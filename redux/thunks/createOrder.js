import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserId } from "../formated/getUserId.js";

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