import { AppThunk } from "../store";
import { toast } from "react-toastify";
import { fetchProducts } from "../products/thunks";
import { setUserDisloged, setUserError, setUserLoading, setUserLogged } from "./userLogged";

export const loginUser =
  (dataToLogin: { email: string; password: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setUserLoading());
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(dataToLogin),
        }
      );

      const data = await response.json();

      if (response.ok && data.user) {
        dispatch(setUserLogged(data.user));
        dispatch(fetchProducts());   
      } else {
        dispatch(setUserError("Credenciales inválidas"));
        toast.error("Algo salió mal, intente nuevamente", {
          position: "top-left",
        });
      }
    } catch (error: any) {
      dispatch(
        setUserError(error.message ?? "Error de red, intente nuevamente")
      );
      console.error("Failed to login:", error);
      toast.error("Algo salió mal, intente nuevamente", {
        position: "top-left",
      });
    }
  };

export const fetchMe = (): AppThunk => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      method: "PUT",
      credentials: "include",
    });
    if (!res.ok) throw new Error("No autenticado");
    const user = await res.json();
    dispatch(setUserLogged(user));
  } catch {
    dispatch(setUserDisloged());
    // no toast aquí, es silencioso
  }
};

export const logoutUser = (): AppThunk => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "No se pudo cerrar sesión");
    }
    dispatch(setUserDisloged());
  } catch (error: any) {
    dispatch(setUserError(error.message ?? "Error al cerrar sesión"));
    console.error("Failed to logout:", error);
  }
};