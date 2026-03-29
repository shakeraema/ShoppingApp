import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";
import checkoutReducer from "./slices/checkoutSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  orders: ordersReducer,
  checkout: checkoutReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "cart", "orders", "checkout"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
