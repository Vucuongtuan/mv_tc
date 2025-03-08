import { createSlice } from "@reduxjs/toolkit";

const fullScreen = createSlice({
  name: "screen",
  initialState: {
    action: false,
  },
  reducers: {
    actionScreen: (state, action) => {
      state.action = action.payload;
    },
  },
});

export const { actionScreen } = fullScreen.actions;
export default fullScreen.reducer;
