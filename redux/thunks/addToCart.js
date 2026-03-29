import { createAsyncThunk } from "@reduxjs/toolkit";
import { addNewCart, buildApiProductsPayload, updateCartById } from "../../services/cartsApi.js";

const getUserId = (state) => state.auth.userData?.id || null;
const isCartNotFoundError = (error) =>
  /cart\s+with\s+id|cart\s+not\s+found|not\s+found/i.test(String(error?.message || error || ""));

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity, size }, { getState, rejectWithValue }) => { // Get the current state to access the auth state and determine which cart to update, and rejectWithValue to handle errors
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to add items to cart");
    }

    const currentCart = state.cart.cartsByUser[userId] || [];
    const productId = String(product.id);
    const productName = product.name || product.productName;
    const productPrice = parseInt(`${product.price}`.replace(/[₦,]/g, ""), 10); // Remove currency symbols and commas before parsing the price, 10 is the radix for decimal numbers
    const productImage = product.image || product.productImage;

    const existingIndex = currentCart.findIndex(
      (item) => String(item.productId) === productId && item.size === size
    );

    let updatedCart = [...currentCart];
    const existingCartId = state.cart.cartIdByUser?.[userId] || null;

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
        sourceCartId: existingCartId,
      });
    }

    try {
      const selectedItem = existingIndex !== -1 ? updatedCart[existingIndex] : updatedCart[updatedCart.length - 1];
      const targetCartId = selectedItem?.sourceCartId || existingCartId;
      const targetCartItems = targetCartId
        ? updatedCart.filter((item) => item.sourceCartId === targetCartId)
        : updatedCart;
      const products = buildApiProductsPayload(targetCartItems);

      if (targetCartId) {
        await updateCartById(targetCartId, { merge: true, products });
        return { userId, cartId: targetCartId, cart: updatedCart };
      }

      await addNewCart({ userId, products });
      const patchedCart = updatedCart.map((item) => ({
        ...item,
        sourceCartId: item.sourceCartId || null,
      }));
      return { userId, cartId: null, cart: patchedCart };
    } catch (error) {
      if (isCartNotFoundError(error)) {
        const recoveredCart = updatedCart.map((item) => ({
          ...item,
          sourceCartId:
            item.sourceCartId && item.sourceCartId === existingCartId
              ? null
              : item.sourceCartId || null,
        }));
        return { userId, cartId: null, cart: recoveredCart };
      }

      return rejectWithValue(error?.message || "Failed to add item");
    }
  }
);