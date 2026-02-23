import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getUserId = (state) => state.auth.userData?.id || null;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => { // Get the current state to access the auth state and determine which cart to fetch
    const state = getState(); 
    const userId = getUserId(state); // Get the user ID from the auth state to determine which cart to fetch
    if (!userId) {
      return { userId: null, cart: [] };
    }

    return {
      userId,
      cart: state.cart.cartsByUser[userId] || [], // Return the cart for the user if it exists, otherwise return an empty array
    };
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity, size }, { getState, rejectWithValue }) => { // Get the current state to access the auth state and determine which cart to update, and rejectWithValue to handle errors
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to add items to cart");
    }

    const currentCart = state.cart.cartsByUser[userId] || [];
    const productId = product.id;
    const productName = product.name || product.productName;
    const productPrice = parseInt(`${product.price}`.replace(/[₦,]/g, ""), 10); // Remove currency symbols and commas before parsing the price, 10 is the radix for decimal numbers
    const productImage = product.image || product.productImage;

    const existingIndex = currentCart.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    let updatedCart = [...currentCart];
    if (existingIndex !== -1) {
      const existingItem = updatedCart[existingIndex];
      updatedCart[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + Number(quantity),
      };
    } else {
      updatedCart.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId,
        productName,
        productPrice: Number(productPrice),
        productImage,
        quantity: Number(quantity),
        size,
      });
    }

    return { userId, cart: updatedCart };
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to update the cart");
    }

    const currentCart = state.cart.cartsByUser[userId] || [];
    const updatedCart = currentCart.filter((item) => item.id !== itemId);
    return { userId, cart: updatedCart };
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to update the cart");
    }

    if (Number(quantity) < 1) {
      return rejectWithValue("Quantity must be at least 1");
    }

    const currentCart = state.cart.cartsByUser[userId] || [];
    const updatedCart = currentCart.map((item) =>
      item.id === itemId ? { ...item, quantity: Number(quantity) } : item
    );

    return { userId, cart: updatedCart };
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState }) => {
    const state = getState();
    const userId = getUserId(state);
    return { userId, cart: [] };
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartsByUser: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (action.payload.userId) {
          state.cartsByUser[action.payload.userId] = action.payload.cart;
        }
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add item";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item";
      })
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.loading = false;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update quantity";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        if (action.payload.userId) {
          state.cartsByUser[action.payload.userId] = action.payload.cart;
        }
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
