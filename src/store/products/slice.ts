import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '../../data/types'

interface ProductsState {
  list: Product[]
  loading: boolean
  error: string | null
}

const initialProducts: ProductsState = {
  list: [],
  loading: false,
  error: null
}

export const productsSlice = createSlice({
  name: 'products',
  initialState: initialProducts,
  reducers: {
    fetchStart(state) { 
      state.loading = true; 
      state.error = null 
    },
    fetchSuccess(state, action: PayloadAction<Product[]>) {
       state.loading = false; 
       state.list = action.payload 
      },
    fetchFailure(state, action: PayloadAction<string>) { 
      state.loading = false; 
      state.error = action.payload 
    },
    addSuccess(state, action: PayloadAction<Product>) { 
      state.list.push(action.payload) 
    },
    updateSuccess(state, action: PayloadAction<Product>) {
      const idx = state.list.findIndex(p => p.id === action.payload.id)
      if (idx !== -1) state.list[idx] = action.payload
    },
    removeSuccess(state, action: PayloadAction<string>) { state.list = state.list.filter(p => p.id !== action.payload) }
  }
})

export const {
  fetchStart: prodFetchStart,
  fetchSuccess: prodFetchSuccess,
  fetchFailure: prodFetchFailure,
  addSuccess: prodAddSuccess,
  updateSuccess: prodUpdateSuccess,
  removeSuccess: prodRemoveSuccess
} = productsSlice.actions
