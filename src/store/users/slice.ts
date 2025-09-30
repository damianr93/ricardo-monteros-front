import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../interfaces/users"

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
}

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsersLoading(state) {
      state.loading = true
      state.error = null
    },
    setUsersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false
      state.users = action.payload
      state.error = null
    },
    setUsersError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    setSelectedUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload
    },
    updateUserInList(state, action: PayloadAction<User>) {
      const index = state.users.findIndex(user => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    clearUsersError(state) {
      state.error = null
    },
    deleteUserFromList(state, action: PayloadAction<string>) {
      state.users = state.users.filter(user => user.id !== action.payload)
    },
    addUserToList(state, action: PayloadAction<User>) {
      state.users.push(action.payload)
    },
  },
})

export const {
  setUsersLoading,
  setUsersSuccess,
  setUsersError,
  setSelectedUser,
  updateUserInList,
  clearUsersError,
  deleteUserFromList,
  addUserToList,
} = usersSlice.actions

export default usersSlice.reducer
