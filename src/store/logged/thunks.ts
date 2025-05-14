import { AppThunk } from "../store"
import { setUserDisloged, setUserLogged } from "./userLogged.ts";
import { toast } from "react-toastify";
import { fetchProducts } from "../products/thunks.ts";

export const loginUser = (dataToLogin: { email: string, password: string }): AppThunk => {
  return async (dispatch) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToLogin)
      });

      const data = await response.json();

      if (response.ok && data.user) {
        dispatch(setUserLogged(data.user));
        dispatch(fetchProducts());
      } else {
        toast.error('Algo salio mal, intente nuevamente', {
          position: 'top-left'
        })
      }

    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error('Algo salio mal, intente nuevamente', {
        position: 'top-left'
      })
    }
  }
}

export const fetchMe = (): AppThunk => async (dispatch) => {

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      method: "PUT",
      credentials: "include",
    });
    if (!res.ok) throw new Error("No autenticado");
    const user = await res.json();
    dispatch(setUserLogged(user));
  } catch {
    console.log('falla')
    dispatch(setUserDisloged())
    //isUserLogged en false
  }
};

export const logoutUser = (): AppThunk => async (dispatch) => {

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
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


