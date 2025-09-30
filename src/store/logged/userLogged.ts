import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interfaces/users";

interface UserLoggedState {
  isLoggedIn: boolean;
  user?: User;
  isAdmin?: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserLoggedState = {
  isLoggedIn: false,
  user: undefined,
  isAdmin: false,
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
    setUserLogged(state, action: PayloadAction<{ user: User; isAdmin?: boolean }>) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin || false;
      state.status = "succeeded";
      state.error = null;
    },
    setUserDisloged(state) {
      state.isLoggedIn = false;
      state.user = undefined;
      state.isAdmin = false;
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