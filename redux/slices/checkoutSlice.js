import { createSlice } from "@reduxjs/toolkit";
import { getDefaultSavedState } from "../../formated/getDefaultSavedState.js";


const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    savedByUser: {},
  },
  reducers: {
    saveShippingAddress: (state, action) => { // Save the shipping address for a specific user
      const { userId, address } = action.payload;
      if (!userId) return;
      state.savedByUser[userId] = {
        ...getDefaultSavedState(state, userId), // Get the existing saved state for the user or initialize it with default values, then update the savedShippingAddress with the new address
        savedShippingAddress: address,
      };
    },
    saveBillingAddress: (state, action) => {
      const { userId, address } = action.payload;
      if (!userId) return;
      state.savedByUser[userId] = {
        ...getDefaultSavedState(state, userId), // existing ssaved state get kore update kora hocche
        savedBillingAddress: address,
      };
    },
    savePaymentMethod: (state, action) => {
      const { userId, method } = action.payload;
      if (!userId) return;
      state.savedByUser[userId] = {
        ...getDefaultSavedState(state, userId),
        savedPaymentMethod: method,
      };
    },
    saveCardDetails: (state, action) => {
      const { userId, card } = action.payload;
      if (!userId) return;
      state.savedByUser[userId] = {
        ...getDefaultSavedState(state, userId),
        savedCardDetails: card,
      };
    },
    clearSavedPayment: (state, action) => {
      const { userId } = action.payload;
      if (!userId) return;
      state.savedByUser[userId] = {
        ...getDefaultSavedState(state, userId),
        savedCardDetails: { number: "", expiry: "", cvv: "" },
      };
    },
  },
});

export const {
  saveShippingAddress,
  saveBillingAddress,
  savePaymentMethod,
  saveCardDetails,
  clearSavedPayment,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
