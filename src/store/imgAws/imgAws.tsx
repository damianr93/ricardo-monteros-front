import { createSlice } from '@reduxjs/toolkit';
import { Image } from '../../data/types';

interface ImagesState {
  list: Image[];
  loading: boolean;
  error: string | null;
}

const initialState: ImagesState = {
  list: [],
  loading: false,
  error: null
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setImages: (state, action) => {
      state.list = action.payload.images;
    },
  }
});

export const { setImages } = imagesSlice.actions;
export default imagesSlice;