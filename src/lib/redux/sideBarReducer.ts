import { createSlice } from "@reduxjs/toolkit";

export const actionSideBar = createSlice({
  name: "action-sidebar",
  initialState: {
    action:
      typeof window !== "undefined"
        ? localStorage.getItem("action-sidebar") === "true"
        : false,
  },
  reducers: {
    changeAction: (state: any, action: { payload: boolean }) => {
      localStorage.setItem("action-sidebar", action.payload.toString());
      state.action = action.payload;
    },
  },
});

export const { changeAction } = actionSideBar.actions;
export default actionSideBar.reducer;
