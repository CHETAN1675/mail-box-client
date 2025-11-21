import { createSlice } from "@reduxjs/toolkit";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

const initialState = {
  token: token || null,
  email: email || null,
  isLoggedIn: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      localStorage.setItem("token", state.token);
      localStorage.setItem("email", state.email);
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
    },
    setEmail(state, action) {
      state.email = action.payload;
      localStorage.setItem("email", state.email);
    }
  },
});

export const { login, logout, setEmail } = authSlice.actions;
export default authSlice.reducer;
