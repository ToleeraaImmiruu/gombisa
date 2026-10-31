import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: { lang: "en" }, // "en" | "om"
  reducers: {
    setLang(state, { payload }) {
      state.lang = payload;
    },
  },
});

export const { setLang } = languageSlice.actions;
export default languageSlice.reducer;
