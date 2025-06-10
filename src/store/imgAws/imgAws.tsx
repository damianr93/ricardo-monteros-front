import { createSlice } from "@reduxjs/toolkit";
import { Image } from "../../data/types";

interface ImagesState {
  list: Image[];
  loading: boolean;
  error: string | null;
  nextToken: string | null;
  hasMore: boolean;
}

const initialState: ImagesState = {
  list: [],
  loading: false,
  error: null,
  nextToken: null,
  hasMore: true,
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setImages: (state, action) => {
      const { images, nextToken, hasMore } = action.payload;
      state.list = [...state.list, ...images]; 
      state.nextToken = nextToken;
      state.hasMore = hasMore;
    },
    resetImages: (state) => {
      state.list = [];
      state.nextToken = null;
      state.hasMore = true;
    },
  }
});

export const { setImages, resetImages } = imagesSlice.actions;
export default imagesSlice;