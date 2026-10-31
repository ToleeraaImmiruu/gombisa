import { createSlice, createSelector } from "@reduxjs/toolkit";

const MAX_QTY = 20;

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] }, // { id, name, slug, price_cents, image_url, stock, quantity }
  reducers: {
    addToCart(state, { payload }) {
      const qty = payload.quantity || 1;
      const limit = Math.min(payload.stock ?? MAX_QTY, MAX_QTY);
      const item = state.items.find((i) => i.id === payload.id);
      if (item) item.quantity = Math.min(item.quantity + qty, limit);
      else state.items.push({ ...payload, quantity: Math.min(qty, limit) });
    },
    setQuantity(state, { payload: { id, quantity } }) {
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      const limit = Math.min(item.stock ?? MAX_QTY, MAX_QTY);
      item.quantity = Math.min(Math.max(1, quantity), limit);
    },
    removeFromCart(state, { payload: id }) {
      state.items = state.items.filter((i) => i.id !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, setQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = createSelector(
  (s) => s.cart.items,
  (items) => items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0)
);
