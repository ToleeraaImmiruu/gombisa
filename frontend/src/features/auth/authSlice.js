import { createSlice } from "@reduxjs/toolkit";

// role: "customer" | "contributor" | "admin"
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, role: null, wants: false, ready: false },
  reducers: {
    setSession(state, { payload }) {
      const { session, role, wants } = payload;
      state.user = session
        ? { id: session.user.id, email: session.user.email, full_name: session.user.user_metadata?.full_name || "" }
        : null;
      state.role = session ? role || "customer" : null;
      state.wants = !!wants;
      state.ready = true;
    },
    setWants(state, { payload }) {
      state.wants = payload;
    },
  },
});

export const { setSession, setWants } = authSlice.actions;
export default authSlice.reducer;
