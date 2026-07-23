import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Settings {
  minOrderAmount: number
}

interface SettingsState {
  minOrderAmount: number
  loading: boolean
  error: string | null
}

const initialState: SettingsState = {
  minOrderAmount: 0,
  loading: false,
  error: null
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true
      state.error = null
    },
    fetchSuccess(state, action: PayloadAction<Settings>) {
      state.loading = false
      state.minOrderAmount = action.payload.minOrderAmount
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateSuccess(state, action: PayloadAction<Settings>) {
      state.minOrderAmount = action.payload.minOrderAmount
    }
  }
})

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  updateSuccess
} = settingsSlice.actions
