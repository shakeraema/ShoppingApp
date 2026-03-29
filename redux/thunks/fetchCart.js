import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCartsByUser, mapServerProductToCartItem } from "../../services/cartsApi.js";

const getUserId = (state) => state.auth.userData?.id || null; 
// Helper function to get the user ID from the auth state, this function checks if there is user data in the auth state and returns the user's ID if it exists, otherwise it returns null. This is used in the fetchCart thunk to determine which cart to fetch based on the currently authenticated user.


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (requestedUserId = null, { getState, rejectWithValue }) => { // Get the current state to access the auth state and determine which cart to fetch
    const state = getState(); 
    const userId = requestedUserId || getUserId(state); // Get the user ID from thunk payload or auth state
    if (!userId) {
      return { userId: null, cart: [], cartId: null };
    }

    try {
      const response = await getCartsByUser(userId);
      const carts = Array.isArray(response?.carts) ? response.carts : [];
      const flattenedProducts = carts.flatMap((cart) => {
        const products = Array.isArray(cart?.products) ? cart.products : [];
        return products.map((product) =>
          mapServerProductToCartItem(product, cart?.id || null)
        );
      });

      return {
        userId,
        cartId: carts[0]?.id || null,
        cart: flattenedProducts,
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch cart");
    }
  }
);