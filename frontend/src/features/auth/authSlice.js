import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, ready: false },
  reducers: {
    setSession(state, { payload }) {
      state.user = payload
        ? { id: payload.user.id, email: payload.user.email, full_name: payload.user.user_metadata?.full_name || "" }
        : null;
      state.ready = true;
    },
  },
});

export const { setSession } = authSlice.actions;
export default authSlice.reducer;
