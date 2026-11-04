import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: null }, // null = follow the device, or "light" / "dark"
  reducers: {
    setTheme(state, { payload }) {
      state.mode = payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
