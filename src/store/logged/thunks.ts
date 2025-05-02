import { AppThunk } from "../store"
import { baseUrl } from '../API.ts'
import { setUserDisloged, setUserLogged } from "./userLogged.ts";


export const loginUser = (dataToLogin: { email: string, password: string }): AppThunk => {
  return async (dispatch) => {

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToLogin)
      });

      const data = await response.json();

      dispatch(setUserLogged(data));

    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }
}

export const fetchMe = (): AppThunk => async (dispatch) => {

  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "PUT",
      credentials: "include",
    });
    if (!res.ok) throw new Error("No autenticado");
    const user = await res.json();
    dispatch(setUserLogged(user));
  } catch {
    console.log('falla')
    //isUserLogged en false
  }
};

export const logoutUser = (): AppThunk => async (dispatch) => {

  try {
    const res = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "No se pudo cerrar sesión");
    }

    dispatch(setUserDisloged());
  } catch {
    console.log('falla')
    //isUserLogged en false
  }
};
