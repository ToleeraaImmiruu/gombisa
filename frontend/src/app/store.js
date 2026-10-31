import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cart from "../features/cart/cartSlice";
import auth from "../features/auth/authSlice";
import language from "../features/language/languageSlice";

const rootReducer = combineReducers({ cart, auth, language });

// Only the cart and the language survive a page refresh. Login is handled by Supabase.
const persisted = persistReducer({ key: "gombisa", storage, whitelist: ["cart", "language"] }, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }),
});
export const persistor = persistStore(store);
