import { createAsyncThunk } from "@reduxjs/toolkit";
import { buildApiProductsPayload, updateCartById } from "../../services/cartsApi.js";

const getUserId = (state) => state.auth.userData?.id || null;
const isCartNotFoundError = (error) =>
  /cart\s+with\s+id|cart\s+not\s+found|not\s+found/i.test(String(error?.message || error || ""));


export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemPayload, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to update the cart");
    }

    const itemId =
      typeof itemPayload === "object" && itemPayload !== null
        ? itemPayload.itemId
        : itemPayload;

    const currentCart = state.cart.cartsByUser[userId] || [];
    const targetItem = currentCart.find((item) => item.id === itemId);
    const cartId =
      (typeof itemPayload === "object" && itemPayload !== null && itemPayload.cartId) ||
      targetItem?.sourceCartId ||
      state.cart.cartIdByUser?.[userId] ||
      null;

    const updatedCart = currentCart.filter((item) => item.id !== itemId);

    try {
      if (cartId) {
        const targetCartItems = updatedCart.filter((item) => item.sourceCartId === cartId);
        await updateCartById(cartId, {
          merge: true,
          products: buildApiProductsPayload(targetCartItems),
        });
      }

      return { userId, cartId, cart: updatedCart };
    } catch (error) {
      if (isCartNotFoundError(error)) {
        const recoveredCart = updatedCart.map((item) => ({
          ...item,
          sourceCartId: item.sourceCartId === cartId ? null : item.sourceCartId || null,
        }));
        return { userId, cartId: null, cart: recoveredCart };
      }

      return rejectWithValue(error?.message || "Failed to remove item");
    }
  }
);