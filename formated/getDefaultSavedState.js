import { emptyAddress, emptyBillingAddress } from "./index.js";


export const getDefaultSavedState = (state, userId) => {
  return (
    state.savedByUser[userId] || {
      savedShippingAddress: emptyAddress,
      savedBillingAddress: emptyBillingAddress,
      savedPaymentMethod: "card",
      savedCardDetails: { number: "", expiry: "", cvv: "" },
    }
  );
};