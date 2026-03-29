import { createSlice } from "@reduxjs/toolkit";
import { fetchCart, addToCart, removeFromCart, updateQuantity, clearCart } from "../thunks/index.js";


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartsByUser: {},
    cartIdByUser: {},
    dirtyByUser: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const ensureCartMaps = (state) => {
      state.cartsByUser = state.cartsByUser || {};
      state.cartIdByUser = state.cartIdByUser || {};
      state.dirtyByUser = state.dirtyByUser || {};
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        ensureCartMaps(state);
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        ensureCartMaps(state);
        if (action.payload.userId) {
          if (state.dirtyByUser[action.payload.userId]) {
            state.loading = false;
            return;
          }

          state.cartsByUser[action.payload.userId] = action.payload.cart;
          state.cartIdByUser[action.payload.userId] = action.payload.cartId || null;
          state.dirtyByUser[action.payload.userId] = false;
        }
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        ensureCartMaps(state);
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })
      .addCase(addToCart.pending, (state) => {
        ensureCartMaps(state);
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        ensureCartMaps(state);
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.cartIdByUser[action.payload.userId] = action.payload.cartId || null;
        state.dirtyByUser[action.payload.userId] = true;
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        ensureCartMaps(state);
        state.loading = false;
        state.error = action.payload || "Failed to add item";
      })
      .addCase(removeFromCart.pending, (state) => {
        ensureCartMaps(state);
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        ensureCartMaps(state);
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.cartIdByUser[action.payload.userId] = action.payload.cartId || null;
        state.dirtyByUser[action.payload.userId] = true;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        ensureCartMaps(state);
        state.loading = false;
        state.error = action.payload || "Failed to remove item";
      })
      .addCase(updateQuantity.pending, (state) => {
        ensureCartMaps(state);
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        ensureCartMaps(state);
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.cartIdByUser[action.payload.userId] = action.payload.cartId || null;
        state.dirtyByUser[action.payload.userId] = true;
        state.loading = false;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        ensureCartMaps(state);
        state.loading = false;
        state.error = action.payload || "Failed to update quantity";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        ensureCartMaps(state);
        if (action.payload.userId) {
          state.cartsByUser[action.payload.userId] = action.payload.cart;
          state.cartIdByUser[action.payload.userId] = action.payload.cartId || null;
          state.dirtyByUser[action.payload.userId] = true;
        }
        state.loading = false;
      })
      .addCase(clearCart.rejected, (state, action) => {
        ensureCartMaps(state);
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export default cartSlice.reducer;
