import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserLogged } from "../../interfaces/users";

interface UserLoggedState {
  isLoggedIn: boolean;
  user?: UserLogged;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserLoggedState = {
  isLoggedIn: false,
  user: undefined,
  status: "idle",
  error: null,
};

export const userLogged = createSlice({
  name: "userLogged",
  initialState,
  reducers: {
    setUserLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    setUserLogged(state, action: PayloadAction<UserLogged>) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setUserDisloged(state) {
      state.isLoggedIn = false;
      state.user = undefined;
      state.status = "idle";
      state.error = null;
    },
    setUserError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setUserLoading,
  setUserLogged,
  setUserDisloged,
  setUserError,
} = userLogged.actions;

export default userLogged.reducer;