import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category } from '../../data/types'

interface CategoriesState {
  list: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoriesState = {
  list: [],
  loading: false,
  error: null
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true
      state.error = null
    },
    fetchSuccess(state, action: PayloadAction<Category[]>) {
      state.loading = false
      state.list = action.payload
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    addSuccess(state, action: PayloadAction<Category>) {
      state.list.push(action.payload)
    },
    updateSuccess(state, action: PayloadAction<Category>) {
      const idx = state.list.findIndex(c => c.id === action.payload.id)
      if (idx !== -1) state.list[idx] = action.payload
    },
    removeSuccess(state, action: PayloadAction<string>) {
      state.list = state.list.filter(c => c.id !== action.payload)
    }
  }
})

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addSuccess,
  updateSuccess,
  removeSuccess
} = categoriesSlice.actions
