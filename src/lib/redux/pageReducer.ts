import { createSlice } from "@reduxjs/toolkit";

const pageTab = createSlice({
  name: "page",
  initialState: {
    value: "Movie",
  },
  reducers: {
    movie: (state) => {
      state.value = "Movie";
    },
    tv_show: (state) => {
      state.value = "TV Show";
    },
  },
});

export const { movie, tv_show } = pageTab.actions;
export default pageTab.reducer;
