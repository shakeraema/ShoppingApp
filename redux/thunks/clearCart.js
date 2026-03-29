import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteCartById } from "../../services/cartsApi.js";

const getUserId = (state) => state.auth.userData?.id || null;
const isCartNotFoundError = (error) =>
  /cart\s+with\s+id|cart\s+not\s+found|not\s+found/i.test(String(error?.message || error || ""));


export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = getUserId(state);

    if (!userId) {
      return { userId: null, cartId: null, cart: [] };
    }

    try {
      const cartId = state.cart.cartIdByUser?.[userId] || null;
      if (cartId) {
        await deleteCartById(cartId);
      }

      return { userId, cartId: null, cart: [] };
    } catch (error) {
      if (isCartNotFoundError(error)) {
        return { userId, cartId: null, cart: [] };
      }

      return rejectWithValue(error?.message || "Failed to clear cart");
    }
  }
);