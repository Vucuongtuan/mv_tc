import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const checkAuth = createSlice({
  name: "page",
  initialState: {
    auth:
      typeof window !== "undefined"
        ? Cookies.get("token")
          ? true
          : false
        : false,
    dataAuth:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("profileUser") ?? "[]")
        : [],
  },
  reducers: {
    auth_login: (state, action) => {
      state.dataAuth = action.payload;
      state.auth = true;
    },
    auth_logout: (state) => {
      Cookies.remove("token");
      state.auth = false;
    },
  },
});

export const { auth_logout, auth_login } = checkAuth.actions;
export default checkAuth.reducer;
