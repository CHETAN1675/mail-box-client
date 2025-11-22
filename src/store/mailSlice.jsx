import { createSlice } from "@reduxjs/toolkit";

const cleanEmail = (email)=>email.replace(/[@.]/g,"_");

const mailSlice = createSlice({
  name: "mail",
  initialState: {
    inbox: [],
    sent: [],
  },
  reducers: {
    setInbox(state, action) {
      state.inbox = action.payload;
    },
    setSent(state, action) {
      state.sent = action.payload;
    },
    clearMail(state) {
      state.inbox = [];
      state.sent = [];
    }
  }
});

export const { setInbox, setSent, clearMail } = mailSlice.actions;
export default mailSlice.reducer;
